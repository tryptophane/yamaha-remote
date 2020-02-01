export interface NetRadioList {

    menuStatus: string;
    menuLayer: number;
    menuName: string;
    currentLine: number;
    maxLine: number;
    lines: Array<{ txt: string; attribute: string; index: number }>;
}
