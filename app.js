 // Define the API URL
 const apiUrl = "http://localhost:3000/blogs";

 // Get a reference to the blog list element
 const blogList = document.getElementById("blog-list");

 // Function to create a new blog post
 function createBlog(event) {
   event.preventDefault();

   // Get the form data
   const formData = new FormData(event.target);

   // Make an AJAX request to create the blog post
   fetch(apiUrl, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(Object.fromEntries(formData)),
   })
     .then((response) => response.json())
     .then((blog) => {
       // Add the new blog to the list
       const row = document.createElement("tr");
       row.innerHTML = `
         <td>${blog.id}</td>
         <td>${blog.title}</td>
         <td>${blog.content}</td>
         <td><img src="${blog.image_path}" alt="${blog.title}"></td>
         <td>
           <button onclick="editBlog(${blog.id})">Edit</button>
           <button onclick="deleteBlog(${blog.id})">Delete</button>
         </td>
       `;
       blogList.appendChild(row);

       // Clear the form
       event.target.reset();
     });
 }

 // Function to load the list of blog posts
 function loadBlogList() {
   // Make an AJAX request to get the list of blog posts
   fetch(apiUrl)
     .then((response) => response.json())
     .then((blogs) => {
       // Clear the existing list of blogs
       blogList.innerHTML = "";

       // Add each blog to the list
       blogs.forEach((blog) => {
         const row = document.createElement("tr");
         row.innerHTML = `
           <td>${blog.id}</td>
           <td>${blog.title}</td>
           <td>${blog.content}</td>
           <td><img src="${blog.image_path}" alt="${blog.title}" style="height: 200px; width:200px;"></td>
           <td>
             <button onclick="editBlog(${blog.id})">Edit</button>
             <button onclick="deleteBlog(${blog.id})">Delete</button>
           </td>
         `;
         blogList.appendChild(row);
       });
     });
 }

 // Function to update a blog post
function updateBlog(id, formData) {
    // Make an AJAX request to update the blog post
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then((response) => response.json())
      .then((blog) => {
        // Find the corresponding row in the table and update its contents
        const row = blogList.querySelector(`tr[data-id="${blog.id}"]`);
        row.innerHTML = `
          <td>${blog.id}</td>
          <td>${blog.title}</td>
          <td>${blog.content}</td>
          <td><img src="${blog.image_path}" alt="${blog.title}"></td>
          <td>
            <button onclick="editBlog(${blog.id})">Edit</button>
            <button onclick="deleteBlog(${blog.id})">Delete</button>
          </td>
        `;
  
        // Clear the form
        document.getElementById("blog-form").reset();
      });
  }
  
  // Function to delete a blog post
  function deleteBlog(id) {
    // Make an AJAX request to delete the blog post
    fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove the corresponding row from the table
        const row = blogList.querySelector(`tr[data-id="${id}"]`);
        row.remove();
      });
  }
  
  // Function to edit a blog post
  function editBlog(id) {
    // Make an AJAX request to get the details of the blog post
    fetch(`${apiUrl}/${id}`)
      .then((response) => response.json())
      .then((blog) => {
        // Fill in the form with the details of the blog post
        const form = document.getElementById("blog-form");
        form.title.value = blog.title;
        form.content.value = blog.content;
        form.image_path.value = blog.image_path;
  
        // Change the form submit handler to update the blog post instead of creating a new one
        form.removeEventListener("submit", createBlog);
        form.addEventListener("submit", (event) => {
          event.preventDefault();
          updateBlog(id, new FormData(event.target));
        });
      });
  }
  
  // Load the list of blog posts when the page loads
  loadBlogList();
  
  // Attach the form submit handler to create new blog posts
  document.getElementById("blog-form").addEventListener("submit", createBlog);
  