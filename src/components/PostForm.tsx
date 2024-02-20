import { useState, useContext, useEffect } from "react";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CATEGORIES, PostProps, categoryType } from "./PostList";
import { create } from "domain";
import { on } from "events";

const PostForm = () => {
  const param = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };
  useEffect(() => {
    if (param?.id) getPost(param?.id);
  }, [param?.id]);
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSummary(post.summary);
      setContent(post.content);
      setCategory(post.category as categoryType);
    }
  }, [post]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post.id) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          title: title,
          summary: summary,
          content: content,
          // local time to string including date time min sec australia

          updateAt: new Date()?.toLocaleDateString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          category: category,
        });
        toast.success("Update success");
        navigate(`/posts/${post.id}`);
      } else {
        await addDoc(collection(db, "posts"), {
          title: title,
          summary: summary,
          content: content,
          createAt: new Date()?.toLocaleDateString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          email: user?.email,
          uid: user?.uid,
          category: category,
        });

        toast.success("Post success");
        navigate("/");
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      target: { name, value },
    } = e;
    if (name === "title") {
      setTitle(value);
    }
    if (name === "summary") {
      setSummary(value);
    }
    if (name === "content") {
      setContent(value);
    }
    if (name === "category") {
      setCategory(value);
    }
  };
  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={title}
          id="title"
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="summary">summary</label>
        <input
          type="text"
          name="summary"
          id="summary"
          value={summary}
          onChange={onChange}
          required
        />
      </div>
      <div className="form__block">
        <label htmlFor="category">category</label>
        <select
          name="category"
          id="category"
          onChange={onChange}
          defaultValue={category}
        >
          <option value="">category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="form__block">
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          id="content"
          value={content}
          onChange={onChange}
          required
        />
      </div>

      <div className="form__block">
        <input
          type="submit"
          value={post ? "Edit" : "Submit"}
          className="form__btn--submit"
        />
      </div>
    </form>
  );
};

export default PostForm;
