import {KlHistoryInterface} from './history/kl-history';
import {KlCanvas} from './canvas/kl-canvas';
import {TTranslationCode} from '../../languages/languages';

export interface IFilterApply {
    context: CanvasRenderingContext2D; // context of selected layer
    klCanvas: KlCanvas;
    input: any; // parameters chosen in modal
    history: KlHistoryInterface;
}

export interface IFilterGetDialogParam {
    context: CanvasRenderingContext2D; // context of selected layer
    klCanvas: KlCanvas;
    maxWidth: number; // limit for klCanvas size
    maxHeight: number;
    currentColorRgb: IRGB;
    secondaryColorRgb: IRGB;
}

export interface IFilterGetDialogResult {
    element: HTMLElement; // contents of modal (excluding title, dialog buttons)
    destroy: () => void; // called when modal closed
    width?: number; // custom modal width
    getInput: () => any; // called when Ok pressed
    errorCallback?: (e: Error) => void; // dialog can call this if error happens and cancel dialog
}

export interface IFilter {
    lang: {
        name: TTranslationCode; // title in modal
        button: TTranslationCode; // text on button in filter tab
    };
    updatePos: boolean; // changes size/orientation of klCanvas
    icon: string; // image url
    isInstant?: boolean; // default false - if instant no modal
    inEmbed: boolean; // is available in embed
    getDialog: null | ((p: IFilterGetDialogParam) => any);
    apply: null | ((p: IFilterApply) => boolean);
}

export interface ITransform {
    x: number;
    y: number;
    scale: number;
    angle: number; // rad
}

// a subset of CanvasRenderingContext2D.globalCompositeOperation
export type IMixMode = (
    'source-over' | // default aka normal
    'darken' |
    'multiply' |
    'color-burn' |
    'lighten' |
    'screen' |
    'color-dodge' |
    'overlay' |
    'soft-light' |
    'hard-light' |
    'difference' |
    'exclusion' |
    'hue' |
    'saturation' |
    'color' |
    'luminosity'
);

export type IKlBasicLayer = {
    opacity: number; // 0 - 1
    mixModeStr?: IMixMode; // default "source-over"
    image: HTMLImageElement | HTMLCanvasElement; // already loaded
};

export type IKlProject = {
    width: number; // int
    height: number; // int
    layers: {
        name: string;
        opacity: number; // 0 - 1
        mixModeStr?: IMixMode; // default "source-over"
        image: HTMLImageElement | HTMLCanvasElement; // already loaded
    }[],
};

// stored in indexedDB
export type IKlStorageProject = {
    id: 1;
    timestamp: number;
    thumbnail?: Blob; // png - may not exist pre 0.5.1
    width: number; // int
    height: number; // int
    layers: {
        name: string;
        opacity: number; // 0 - 1
        mixModeStr?: IMixMode; // default "source-over"
        blob: Blob; // png
    }[],
};

export interface IRGB {
    r: number; // [0, 255]
    g: number;
    b: number;
}

export interface IRGBA {
    r: number; // [0, 255]
    g: number;
    b: number;
    a: number; // [0, 1]
}

export interface IInitState {
    canvas: KlCanvas;
    focus: number; // index of selected layer
    brushes: any; // todo type
}

export interface IGradient {
    type: 'linear' | 'linear-mirror' | 'radial';
    color1: IRGB;
    isReversed: boolean; // color1 actually color2
    opacity: number; // [0, 1]
    doLockAlpha: boolean;
    doSnap: boolean; // 45° deg angle snapping
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    angleRad: number; // angle of canvas
    isEraser: boolean;
}

export interface IShapeToolObject {
    type: 'rect' | 'ellipse' | 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    angleRad?: number; // angle of canvas, default 0
    isOutwards?: boolean; // center is x1 y1, default false
    opacity?: number; // 0-1, default 1
    isEraser?: boolean; // default false
    fillRgb?: { r: number; g: number; b: number }; // for rect or ellipse
    strokeRgb?: { r: number; g: number; b: number }; // needed for line
    lineWidth?: number; // needed for line
    isAngleSnap?: boolean; // 45° deg angle snapping
    isFixedRatio?: boolean; // 1:1 for rect or ellipse
    doLockAlpha?: boolean; // default false
}

export interface IKlSliderConfig {
    min: number;
    max: number;
    curve?: [number, number][] | 'quadratic';
    isDisabled?: boolean; // default enabled
}

export interface ISliderConfig {
    sizeSlider: IKlSliderConfig;
    opacitySlider: IKlSliderConfig;
}

export interface IBrushUi extends ISliderConfig {
    image: string;
    tooltip: string;
    Ui: (
        p: {
            onSizeChange: (size: number) => void,
            onOpacityChange: (size: number) => void,
            onConfigChange: () => void,
        }
    ) => void;
}

export type TKlPsdError = 'mask' | 'clipping' | 'group' | 'adjustment' | 'layer-effect' | 'smart-object' | 'blend-mode' | 'bits-per-channel';

/**
 * Psd interpreted for usage in Klecks.
 */
export interface IKlPsd {
    type: 'psd';
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    layers?: { // not there if flattened
        name: string;
        mixModeStr: IMixMode;
        opacity: number;
        image: HTMLCanvasElement;
    }[];
    // if one of these features show up, they become a warning
    // because Klecks can't properly represent them (yet)
    warningArr?: TKlPsdError[];
    error?: boolean; // true if flattened (too many layers)
}
