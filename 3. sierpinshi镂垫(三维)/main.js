let ITERATION_NUM = 3;

function main() {
    const canvas = document.getElementById('gl-canvas');
    const gl = canvas.getContext('webgl');

    const vertices = [
        vec3(0.0000, 0.0000, -1.0000),
        vec3(0.0000, 0.9428, 0.3333),
        vec3(-0.8165, -0.4714, 0.3333),
        vec3(0.8165, -0.4714, 0.3333)
    ];

    const colorMap = [
        vec4(1.0, 0.0, 0.0, 1.0),
        vec4(0.0, 1.0, 0.0, 1.0),
        vec4(0.0, 0.0, 1.0, 1.0),
        vec4(0.0, 0.0, 0.0, 0.0)
    ]

    const points = [], colors = [];

    /**
    * @param {vec3} a
    * @param {vec3} b
    * @param {vec3} c
    * @param {vec3} d
    * @param {int} count
    */

    function triangle () {
        const arr = Array.prototype.slice.call(arguments);
        const vertexs = arr.splice(0, arr.length - 1);
        const color = arr[0];
        points.push(...vertexs);
        colors.push(...[color, color, color]);
    }
    
    const tetra = (a, b, c, d) => {
        triangle(a, b, c, colorMap[0]);
        triangle(a, b, d, colorMap[1]);
        triangle(a, c, d, colorMap[2]);
        triangle(b, c, d, colorMap[3]);
    }

    const divideTetra = (a, b, c, d, count) => {
        if (count === 0) {
            tetra(a, b, c, d);
        } else {
            const ab = mix(a, b, 0.5);
            const ac = mix(a, c, 0.5);
            const ad = mix(a, d, 0.5);
            const bc = mix(b, c, 0.5);
            const bd = mix(b, d, 0.5);
            const cd = mix(c, d, 0.5);

            --count;

            divideTetra(a, ab, ac, ad, count);
            divideTetra(b, bc, ab, bd, count);
            divideTetra(c, ac, bc, cd, count);
            divideTetra(d, ad, cd, bd, count);
        }
    }

    divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], ITERATION_NUM);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    
    const program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);

    const cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    const vColor = gl.getAttribLocation(program, 'vColor');
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    const vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}