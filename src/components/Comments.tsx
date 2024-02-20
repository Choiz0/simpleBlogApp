import { useContext, useState } from "react";
import { CommentsInterface, PostProps } from "./PostList";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";

interface CommentProps {
  post: PostProps;
  getPost: (id: string) => Promise<void>;
}
const Comments = ({ post, getPost }: CommentProps) => {
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "comment") {
      setComment(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post && post?.id) {
        const postRef = doc(db, "posts", post.id);
        if (user?.uid) {
          const commentObj = {
            content: comment,
            uid: user.uid,
            createdAt: new Date().toLocaleDateString("en-AU", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            email: user.email,
          };
          await updateDoc(postRef, {
            comments: arrayUnion(commentObj),
            updateDated: new Date().toLocaleDateString("en-AU", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          });
          await getPost(post.id);
        }
      }
      toast.success("Comment success");
      setComment("");
    } catch (e: any) {
      console.error("Error");
    }
  };
  const handleDeleteComment = async (data: CommentsInterface) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm && post?.id) {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: arrayRemove(data),
      });
      await getPost(post.id);
    }
  };
  return (
    <div className="comments">
      <form className="comments__form" onSubmit={onSubmit}>
        <div className="form__block">
          <label htmlFor="comment">Comment</label>
          <textarea
            name="comment"
            value={comment}
            onChange={onChangeHandler}
            id="comment"
            placeholder="Write your comment here"
            required
          ></textarea>
        </div>
        <div className="form__block form__block-reverse ">
          <input
            type="submit"
            value="Add Comment"
            className="form__btn-submit"
          />
        </div>
        <div className="comments__list">
          {post?.comments
            ?.slice(0)
            ?.reverse()
            .map((comment) => (
              <div key={comment.uid} className="comment__box">
                <div className="comment__profile-box">
                  <div className="comment__email">{comment?.email}</div>
                  <div className="comment__date">{comment?.createdAt}</div>
                  {comment.uid === user?.uid && (
                    <div
                      className="comment__delete"
                      onClick={() => handleDeleteComment(comment)}
                    >
                      Delete
                    </div>
                  )}
                </div>
                <div className="comment__text">{comment.content}</div>
              </div>
            ))}
        </div>
      </form>
    </div>
  );
};

export default Comments;
