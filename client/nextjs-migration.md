# Client Side to Server Side(Next Js) Migration

- Install next js in your existing react js project
- Open package.json and change scripts

```sh
scripts: {
 "dev": "next dev",
 "build": "next build",
 "start": "next start"
}
```

- To create a route, create "pages" directory for example "pages/about.js" is mapped to "/about"
- Keep all images in public folder
- To start your application run command

```
npm run dev
```

- Application will start running on http://localhost:3000
- To integrate material ui theme refer https://github.com/mui-org/material-ui/tree/master/examples/nextjs
- To integrate redux refer https://github.com/vercel/next.js/tree/canary/examples/with-redux
- To do initial data population use "getInitailProps". Take a look at the following example:-

```sh
function Page({ stars }) {
 return <div>Next stars: {stars}</div>
}
Page.getInitialProps = async (ctx) => {
 const res = await fetch('https://api.github.com/repos/vercel/next.js')
 const json = await res.json()
   return { stars: json.stargazers_count }
}
export default Page
```

### Next Js Documentation

https://nextjs.org/docs/getting-started
