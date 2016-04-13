// const formDom = document.getElementsByClassName('fileForm')[0]
// const fileDom = document.getElementsByClassName('fileInput')[0]
// const submitBtn = document.getElementsByClassName('subBtn')[0]

// submitBtn.addEventListener('click', (e) => {
// 	e.preventDefault();

// 	const files = fileDom.files

// 	if(files.length) {
// 		console.log(files)

// 		const formData = new window.FormData(formDom)

// 		$.ajax({
// 		  url: '/test/upload/image',
// 		  method: 'post',
// 		  data: formData,
// 		  processData: false,
// 		  contentType: false
// 		}).then(data => {
// 		  // 上传成功，服务端设置返回
// 		  console.log(data);
// 		});
// 	} else {
// 		alert('choose file')
// 	}
// })
