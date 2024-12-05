import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";



export default function Update() {
    const {id} = useParams();
    const {token, user} = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        body: ""
    });

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});

    async function getPost() {

        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();

        if (res.ok) {
            if (data.post.user_id !== user.id) {
                navigate("/");
            }
            setFormData({
                title: data.post.title,
                body: data.post.body

            });
            console.log(data.post);
         
        }

    }

    async function handleUpdate(e) {
        e.preventDefault();

        const res = await fetch(`/api/posts/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        console.log(data);
        
        if (data.errors) {
            setErrors(data.errors);
            console.log(data);
        } else {
            console.log(data);
            navigate("/");
        }
        
    }

    useEffect(() => {
        console.log('user', user);
        
        getPost();
    },[]);

    return (
        <>
            <h1 className="title">Update a new post</h1>
            <form onSubmit={handleUpdate} className="w-1/2 mx-auto space-y-6">
                <div>
                    <input type="text" placeholder="Post Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    {errors.title && <p className="error">{errors.title[0]}</p>}
                </div>

                <div>
                    <textarea rows="6" placeholder="Post content" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})}></textarea>
                    {errors.body && <p className="error">{errors.body[0]}</p>}

                </div>

                <button className="primary-btn">Update Post</button>
            </form>
        </>
    )
}