export class AnnotUI{
    private canvas_element: HTMLCanvasElement;
    private gl: WebGLRenderingContext;

    private width: number = -1;
    private height: number = -1;

    constructor(canvas_element: HTMLCanvasElement){
        this.canvas_element = canvas_element;
        let gl = (canvas_element.getContext('webgl') || canvas_element.getContext('experimental-webgl'));
        if(gl != null){
            this.gl = gl;
        }else{
            throw new Error('There is no webgl context.')
        }
        this.init();
        
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    private animate(): void {
        console.log('animate');
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        requestAnimationFrame(() => this.animate())
    }

    private init(): void {
        this.resized();
        setInterval(() => this.resized(), 100);
        requestAnimationFrame(() => this.animate())
    }

    private resized(): void {
        let {width, height} = this.canvas_element.getBoundingClientRect();
        if(this.width !== width || this.height !== height){
            this.width = width; this.height = height;
            this.gl.viewport(0, 0, this.width, this.height);
            console.log([width, height]);
        }
    }
}
