

function submitForm() {
  event.preventDefault();
  const form = document.getElementById("myForm");
  const formData = new FormData(form);

  const jsonData = {};
  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }

  console.log(jsonData);

  fetch("./api-v2/post_json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: "201",
      info: "前端传递的数据",
      data: jsonData
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  }).then(data => {
    console.log(data);
  }).catch(error => {
    console.error(error);
  });
}