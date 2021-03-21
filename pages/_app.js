import '../styles/globals.css'
import Head from "next/head";
import 'antd/dist/antd.css';
import 'highlight.js/styles/atom-one-light.css'
import 'react-markdown-editor-lite/lib/index.css';
import { LayoutHeader } from 'components/LayoutHeader';
import { Layout, Menu } from 'antd';
const { Footer, Sider, Content } = Layout
import { useRouter } from 'next/router'
var arr = ['/sign_in','/sign_up','/','page=','/record','/tags']

function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter()
  const router = useRouter()

  const handleOk = (key) =>{
    if(key.key === '1'){
      router.push('/backstage/articleList/list')
    }else{
    router.push('/backstage/tagsList')
    }
  }

  const match = (path) =>{
    var result
    for(let i = 0;i<arr.length;i++){
      if(arr[i].includes(path)){
        result = true
        break
      } if(path.includes('/?page=') || path.includes('/posts/') || path.includes('/tags#')){
        result = true
        break
      }else{
        result = false
      }
    }
    return result
  }
  return <>
    <Head>
      <title>記</title>
      <meta name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/default.min.css"></link>
    </Head>

  {
    match(asPath) ?  <Component {...pageProps} /> : <>
        <Layout style={{ height: '100vh'}}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
              onClick={handleOk}
              >
              <Menu.Item key="1" >文章列表</Menu.Item>
              <Menu.Item key="2" >标签列表</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <LayoutHeader></LayoutHeader>
            <Content style={{ margin: '24px 16px 0' }}>
              <Component {...pageProps} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
      </Layout>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js"></script>
    </>
  }
    </>
}


export default MyApp
