import './Blog.css'

function Blog({title,body,tags,category,publishedAt}){
  console.log('title',title)
    return(
        <div className='container'>
          <div className='blog'>
            <div className='imgBx'>
                <h1>{title}</h1>
                <p> <br/>{body}</p>
                <h1>{tags}</h1>
                <h1>{category}</h1>
                <h1>{publishedAt}</h1>
            </div>
          </div>
        </div>
    )
}



export default Blog