import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, MouseEventHandler } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "firebaseApp";

import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";

interface PostListProps {
  hasNavigation?: boolean;
  defaultTab?: TabType | categoryType;
}
export interface CommentsInterface {
  uid: string;
  content: string;
  createdAt: string;
  email: string;
}
export interface PostProps {
  id?: string;
  title: string;
  summary: string;
  content: string;
  createAt: string;
  email: string;
  updateAt?: string;
  uid: string;
  category?: categoryType;
  createdAt: string;
  updatedAt?: string;
  comments?: CommentsInterface[];
}
export type categoryType = "Frontend" | "Backend" | "tools" | "Other";
export const CATEGORIES: categoryType[] = [
  "Frontend",
  "Backend",
  "tools",
  "Other",
];
type TabType = "all" | "my";

const PostList = ({
  hasNavigation = true,
  defaultTab = "all",
}: PostListProps) => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeTab, setActiveTab] = useState<TabType | categoryType>(
    defaultTab
  );

  const getPost = async () => {
    setPosts([]);
    console.log("Current activeTab:", activeTab);
    let queryRef = collection(db, "posts");
    let postQuery;
    if (activeTab === "my" && user) {
      postQuery = query(
        queryRef,
        where("uid", "==", user?.uid),
        orderBy("createAt", "desc")
      );
    } else if (activeTab === "all") {
      postQuery = query(queryRef, orderBy("createAt", "desc"));
    } else {
      // 카테고리 글 보여주기
      console.log(`Querying posts in category: ${activeTab}`);
      postQuery = query(
        queryRef,
        where("category", "==", activeTab),
        orderBy("createAt", "desc")
      );
    }
    const data = await getDocs(postQuery);
    console.log(
      `Posts fetched for ${activeTab}:`,
      data.docs.map((doc) => doc.data())
    );
    data?.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj as PostProps]);
    });
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm && id) {
      deleteDoc(doc(db, "posts", id));
      toast.success("Delete success");
      getPost();
    } else return;
  };

  useEffect(() => {
    getPost();
  }, [activeTab]);

  return (
    <>
      {hasNavigation && (
        <div className="post__navigation">
          <div
            role="presentation"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "post__navigation--active" : ""}
          >
            TOTAL
          </div>
          <div
            role="presentation"
            onClick={() => setActiveTab("my")}
            className={activeTab === "my" ? "post__navigation--active" : ""}
          >
            MY POST
          </div>
          {CATEGORIES.map((category) => (
            <div
              role="presentation"
              onClick={() => setActiveTab(category)}
              className={
                activeTab === category ? "post__navigation--active" : ""
              }
            >
              {category}
            </div>
          ))}
        </div>
      )}

      <div className="post__list">
        {posts && posts.length > 0
          ? posts.map((post, index) => (
              <div key={post.id} className="post__box">
                <Link to={`/posts/${post.id}`}>
                  <div className="post__profile-box">
                    <div className="post__profile" />
                    <div className="post__author-name">{post?.email}</div>
                    <div className="post__date">{post?.createAt}</div>
                  </div>
                  <div className="post__title">{post?.content}</div>
                  <div className="post__text">
                    {post.summary}
                    <span>...</span>
                  </div>
                </Link>
                {post.email === user?.email && (
                  <div className="post__utils-box">
                    <div
                      className="post__delete"
                      role="presentation"
                      onClick={() => handleDelete(post?.id as string)}
                    >
                      Delete
                    </div>
                    <Link to={`posts/edit/${post?.id}`} className="post__edit">
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            ))
          : "No post"}
      </div>
    </>
  );
};

export default PostList;
