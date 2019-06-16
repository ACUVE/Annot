export class AnnotUI{
    canvas_element: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    constructor(canvas_element: HTMLCanvasElement){
        this.canvas_element = canvas_element;
        let gl = (canvas_element.getContext('webgl') || canvas_element.getContext('experimental-webgl'));
        if(gl != null){
            this.gl = gl;
        }else{
            throw new Error('There is no webgl context.')
        }
        
        console.log(gl);

        gl.clearColor(0, 0, 0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
