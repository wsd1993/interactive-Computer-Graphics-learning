const POINTS_NUM = 5000;

function main() {
    const canvas = document.getElementById('gl-canvas');
    const gl = canvas.getContext('webgl');
    const vertices = [
        vec2(0.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0)
    ];
    let u = add(vertices[0], vertices[1]);
    let v = add(vertices[0], vertices[2]);
    let p = scale(0.5, add(u, v));

    const points = [p];

    for (let i = 0; points.length < POINTS_NUM; ++i) {
        const temp = Math.floor(Math.random() * vertices.length);
        p = add(points[i], vertices[temp]);
        p = scale(0.5, p);
        points.push(p);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);
    
    /**
     * 创建缓存区并绑定为当前缓冲区
    */
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    // console.log(vPosition)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}