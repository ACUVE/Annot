export class AnnotUI{
    private canvas_element: HTMLCanvasElement;
    private gl: WebGLRenderingContext;

    private width: number = -1;
    private height: number = -1;

    private vertex_position_buffer: WebGLBuffer;

    private program: GLProgram;
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
        const vertex_shader = this.compileShader(gl.VERTEX_SHADER, `attribute vec4 pos; void main(){gl_Position = pos;}`);
        const fragment_shader = this.compileShader(gl.FRAGMENT_SHADER, `void main(){gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);}`);
        this.program = new GLProgram(gl, [vertex_shader, fragment_shader]);
        const pos_pos = this.program.attrib_pos.get('pos');
        if(pos_pos === undefined) throw new Error('shader has no pos variable??');
        this.pos_pos = pos_pos;

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        requestAnimationFrame(() => this.animate())
    }

    private animate(): void {
        console.log('animate');
        const gl = this.gl;

        gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_position_buffer);
        gl.vertexAttribPointer(this.pos_pos, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.pos_pos);

        this.program.use();

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

    private resized(): void {
        const {width, height} = this.canvas_element.getBoundingClientRect();
        if(this.width !== width || this.height !== height){
            this.width = width; this.height = height;
        }
    }
}

class GLProgramBase{
    private gl: WebGLRenderingContext;
    protected program: WebGLProgram;

    constructor(gl: WebGLRenderingContext, shaders: Array<WebGLShader>){
        this.gl = gl;
        const program = gl.createProgram();
        if(program === null) throw new Error('createProgram failed.');
        for(let shader of shaders){
            gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.debug(gl.getProgramInfoLog(program))
            throw new Error('linkProgram failed.');
        }
        this.program = program;
    }

    public use(): void {
        this.gl.useProgram(this.program);
    }
    public getActiveUniform(index: number): WebGLActiveInfo | null {
        return this.gl.getActiveUniform(this.program, index);
    }
    public getActiveAttrib(index: number): WebGLActiveInfo | null {
        return this.gl.getActiveAttrib(this.program, index);
    }
    public getActiveUniformNumber(): number {
        return <number>this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
    }
    public getActiveAttribNumber(): number {
        return <number>this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
    }
    public getAttribLocation(name: string): GLint {
        return this.gl.getAttribLocation(this.program, name);
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }
}

class GLProgram extends GLProgramBase{
    private active_attrib: Array<WebGLActiveInfo> = [];
    private active_uniform: Array<WebGLActiveInfo> = [];
    public readonly attrib_pos: Map<string, GLint> = new Map();
    public readonly uniform_pos: Map<string, GLint> = new Map();

    constructor(gl: WebGLRenderingContext, shaders: Array<WebGLShader>){
        super(gl, shaders);

        const attrib_num = this.getActiveAttribNumber();
        for(let i = 0; i < attrib_num; ++i){
            this.active_attrib.push(<WebGLActiveInfo>this.getActiveAttrib(i));
        }
        for(let info of this.active_attrib){
            this.attrib_pos.set(info.name, this.getAttribLocation(info.name));
        }
        const uniform_num = this.getActiveUniformNumber();
        for(let i = 0; i < uniform_num; ++i){
            this.active_uniform.push(<WebGLActiveInfo>this.getActiveUniform(i));
        }
        for(let info of this.active_uniform){
            this.uniform_pos.set(info.name, this.getAttribLocation(info.name));
        }
    }
}
