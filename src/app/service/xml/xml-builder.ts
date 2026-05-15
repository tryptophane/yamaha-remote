export type HttpMethod = 'GET' | 'PUT';

export const GET_PARAM = 'GetParam';

export type XmlValue = string | number | XmlBody;

export interface XmlBody {
  readonly [tag: string]: XmlValue;
}

const renderBody = (body: XmlValue): string => {
  if (typeof body === 'string' || typeof body === 'number') {
    return String(body);
  }
  return Object.entries(body)
    .map(([tag, value]) => `<${tag}>${renderBody(value)}</${tag}>`)
    .join('');
};

const wrapPath = (path: ReadonlyArray<string>, inner: string): string =>
  path.reduceRight((acc, tag) => `<${tag}>${acc}</${tag}>`, inner);

/**
 * Build a YAMAHA_AV command XML from a path and a value (or nested body).
 *
 * Example: buildCommand('PUT', ['Main_Zone', 'Power_Control', 'Power'], 'On')
 *   → <YAMAHA_AV cmd="PUT"><Main_Zone><Power_Control><Power>On</Power></Power_Control></Main_Zone></YAMAHA_AV>
 */
export const buildCommand = (
  method: HttpMethod,
  path: ReadonlyArray<string>,
  body: XmlValue
): string =>
  `<YAMAHA_AV cmd="${method}">${wrapPath(path, renderBody(body))}</YAMAHA_AV>`;

/** Standard Yamaha decibel value body: `{Val, Exp, Unit: 'dB'}`. */
export const dbValue = (val: number | string): XmlBody => ({
  /* eslint-disable @typescript-eslint/naming-convention */
  Val: val,
  Exp: 1,
  Unit: 'dB'
  /* eslint-enable @typescript-eslint/naming-convention */
});
