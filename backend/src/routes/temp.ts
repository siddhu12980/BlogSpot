//create a arrow function 

export default  {
    async fetch(request: { url: string | URL; method: any; body: any; }, env: { MY_BUCKET: { put: (arg0: string, arg1: any) => any; }; }) {
      const url = new URL(request.url);
      const key = url.pathname.slice(1);
  
      switch (request.method) {
        case 'PUT':
          await env.MY_BUCKET.put(key, request.body);
          return new Response(`Put ${key} successfully!`);
  
        default:
          return new Response(`${request.method} is not allowed.`, {
            status: 405,
            headers: {
              Allow: 'PUT',
            },
          });
      }
    },
  };