const createOrder = async (obj) => {
    const res = await fetch('http://127.0.0.1:8000/api/create-order/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ5NzEyMTExLCJpYXQiOjE3NDk2NTIxMTEsImp0aSI6IjgwNTlhNDdmMjU0NzRiNGFiYWQxYWI1NGZlNTU0OGI4IiwidXNlcl9pZCI6Mn0.jcTmoiNB_FlvIU_zhEaIZ6YURdQ8fzhlp7B1JAj4qv4',
      },
      body: JSON.stringify(obj),
    });
  
    const data = await res.json();
    console.log(data);
    return data;
  };
  
  export default createOrder;
  