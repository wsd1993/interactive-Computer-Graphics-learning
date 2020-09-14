let ITERATION_NUM = 5;

function main() {
    const canvas = document.getElementById('gl-canvas');
    const gl = canvas.getContext('webgl');

    const vertices = [
        vec2(0.0, 1.0),
        vec2(1.0, -1.0),
        vec2(-1.0, -1.0)
    ];

    const points = [];

    /**
    * @param {vec2} a
    * @param {vec2} b
    * @param {vec2} c
    * @param {int} count
    */

    function triangle () {
        const arr = Array.prototype.slice.call(arguments);
        points.push(...arr);
    }

    const divide = (a, b, c, count) => {
        if (count === 0) {
            triangle(a, b, c);
        } else {
            const ab = mix(a, b, 0.5);
            const ac = mix(a, c, 0.5);
            const bc = mix(b, c, 0.5);

            --count;

            divide(a, ab, ac, count);
            divide(b, ab, bc, count);
            divide(c, ac, bc, count);
        }
    }

    divide(vertices[0], vertices[1], vertices[2], ITERATION_NUM);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}