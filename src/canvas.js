const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const textInput = document.getElementById("text-input");
const fileInput = document.getElementById("file-input");
const submitButton = document.getElementById("submit");

const fileToBase64 = async (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = reject;
});

const drawImage = (file) => {
	const base64String = await fileToBase64(file);

	const image = new Image();
	image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
	image.src = base64String; 
};

const paintText = text => () => {
	context.fillText()
}

submitButton.addEventListener("click", () => {
    (async function() {
		await drawImage(fileInput.files[0]);


	})();
});

fileInput.addEventListener("change", () => {

});