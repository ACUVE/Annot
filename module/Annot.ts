export class AnnotUI{
    private canvas_element: HTMLCanvasElement;
    private gl: WebGLRenderingContext;

    private width: number = -1;
    private height: number = -1;

    private vertex_position_buffer: WebGLBuffer;
    
    private vertex_shader: WebGLShader;
    private fragment_shader: WebGLShader;
    private program: WebGLProgram;
    private pos_pos: GLint;

    constructor(canvas_element: HTMLCanvasElement){
        this.canvas_element = canvas_element;

        const gl = (canvas_element.getContext('webgl') || canvas_element.getContext('experimental-webgl'));
        if(gl === null) throw new Error('There is no webgl context.')
        this.gl = gl;

        // initialize
        this.resized();
        setInterval(() => this.resized(), 100);

        const positions = [
            -0.9, 0.9, 0, 1.0,
            0.9, 0.9, 0, 1.0,
            -0.9, -0.9, 0, 1.0,
            0.9, -0.9, 0, 1.0,
        ];

        this.vertex_position_buffer = this.genBuffer(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        this.vertex_shader = this.compileShader(gl.VERTEX_SHADER, `attribute vec4 pos; void main(){gl_Position = pos;}`);
        this.fragment_shader = this.compileShader(gl.FRAGMENT_SHADER, `void main(){gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);}`);
        this.program = this.linkProgram(this.vertex_shader, this.fragment_shader);
        this.pos_pos = gl.getAttribLocation(this.program, 'pos');
        
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        // gl.clearDepth(1.0);
        // gl.enable(gl.DEPTH_TEST);
        // gl.depthFunc(gl.LEQUAL);

        requestAnimationFrame(() => this.animate())
    }

    private animate(): void {
        console.log('animate');
        const gl = this.gl;

        gl.clear(this.gl.COLOR_BUFFER_BIT/* | this.gl.DEPTH_BUFFER_BIT*/);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
        gl.vertexAttribPointer(this.pos_pos, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.pos_pos);

        gl.useProgram(this.program);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(() => this.animate())
    }
    
    private genBuffer(target: GLenum, data: BufferSource, usage: GLenum): WebGLBuffer {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        if(buffer === null) throw new Error('createBuffer failed.');
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, usage);
        return buffer;
    }

    private compileShader(type: number, source: string): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if(shader === null) throw new Error('createShader failed.');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.debug(gl.getShaderInfoLog(shader));
            throw new Error('compileShader failed.');
        }
        return shader;
    }
    
    private linkProgram(vertex_shader: WebGLShader, fragment_shader: WebGLShader): WebGLProgram {
        const gl = this.gl;
        const program = gl.createProgram();
        if(program === null) throw new Error('createProgram failed.');
        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.debug(gl.getProgramInfoLog(program))
            throw new Error('linkProgram failed.');
        }
        return program;
    }

    private resized(): void {
        const {width, height} = this.canvas_element.getBoundingClientRect();
        if(this.width !== width || this.height !== height){
            this.width = width; this.height = height;
        }
    }
}
