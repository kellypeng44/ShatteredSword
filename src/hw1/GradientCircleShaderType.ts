import Map from "../Wolfie2D/DataTypes/Map";
import Mat4x4 from "../Wolfie2D/DataTypes/Mat4x4";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import RectShaderType from "../Wolfie2D/Rendering/WebGLRendering/ShaderTypes/RectShaderType";

/**
 * The gradient circle is technically rendered on a quad, and is similar to a rect, so we'll extend the RectShaderType
 */
export default class GradientCircleShaderType extends RectShaderType {

	initBufferObject(): void {
		this.bufferObjectKey = "gradient_circle";
		this.resourceManager.createBuffer(this.bufferObjectKey);
	}

	render(gl: WebGLRenderingContext, options: Record<string, any>): void {
		// Get our program and buffer object
		const program = this.resourceManager.getShaderProgram(this.programKey);
		const buffer = this.resourceManager.getBuffer(this.bufferObjectKey);

		// Let WebGL know we're using our shader program
		gl.useProgram(program);

		// Get our vertex data
		const vertexData = this.getVertices(options.size.x, options.size.y);
		const FSIZE = vertexData.BYTES_PER_ELEMENT;

		// Bind the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

		/* ##### ATTRIBUTES ##### */
		// No texture, the only thing we care about is vertex position
		const a_Position = gl.getAttribLocation(program, "a_Position");
		gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 2 * FSIZE, 0 * FSIZE);
		gl.enableVertexAttribArray(a_Position);

		/* ##### UNIFORMS ##### */
		// Send the color to the gradient circle
		const color = options.color.toWebGL();
		const u_Color = gl.getUniformLocation(program, "u_Color");
		gl.uniform4fv(u_Color, color);

		// Get transformation matrix
		// We have a square for our rendering space, so get the maximum dimension of our quad
		let maxDimension = Math.max(options.size.x, options.size.y);

		// The size of the rendering space will be a square with this maximum dimension
		let size = new Vec2(maxDimension, maxDimension).scale(2/options.worldSize.x, 2/options.worldSize.y);

		// Center our translations around (0, 0)
		const translateX = (options.position.x - options.origin.x - options.worldSize.x/2)/maxDimension;
		const translateY = -(options.position.y - options.origin.y - options.worldSize.y/2)/maxDimension;

		// Create our transformation matrix
		this.translation.translate(new Float32Array([translateX, translateY]));
		this.scale.scale(size);
		this.rotation.rotate(options.rotation);
		let transformation = Mat4x4.MULT(this.translation, this.scale, this.rotation);

		// Pass the translation matrix to our shader
		const u_Transform = gl.getUniformLocation(program, "u_Transform");
		gl.uniformMatrix4fv(u_Transform, false, transformation.toArray());

		// Draw the quad
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}