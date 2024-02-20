import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PostProps } from "./PostList";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import Loader from "./Loader";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";
import Comments from "./Comments";

const PostDetail = () => {
  const [post, setPost] = useState<PostProps | null>(null);

  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };
  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete?");

    if (confirm && id) {
      deleteDoc(doc(db, "posts", id));
      toast.success("Delete success");
      getPost(id);
    } else return;
  };

  return (
    <>
      <div className="post__detail">
        <div className="post__box">
          <div className="post__title">{post ? post.title : <Loader />}</div>
          <div className="post__profile-box">
            <div className="post__profile" />
            <div className="post__author-name">{post?.email}</div>
            <div className="post__date">{post?.createAt}</div>
          </div>
          <div className="post__utils-box">
            <div className="post__category">
              {post?.category ? post.category : ""}
            </div>
            <div>
              <Link
                to={`/posts/delete/1`}
                onClick={() => handleDelete(post?.id as string)}
                className="post__delete"
              >
                Delete
              </Link>
            </div>

            <div className="post__edit">
              <Link to={`/posts/edit/${post?.id}`}>Edit</Link>
            </div>
          </div>

          <div className="post__text">
            <p>{post ? post.content : <Loader />}</p>
          </div>
        </div>
        {post && <Comments post={post} getPost={getPost} />}
      </div>
    </>
  );
};

export default PostDetail;
