import React, { useState, useEffect } from "react";
import { Container } from "../components/index";
import appWriteservice from "../appwrite/conf";
import { PostCard } from "../components/index";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    appWriteservice.getPosts().then((posts) => {
      if (posts) setPosts(posts.documents);
    });
  }, []);
  return (
    <div className="w-full py-8">
      <Container>
        {posts.map((post) => (
          <div key={post.$id} className="p-2 w-1/4">
            <PostCard {...post}/>
          </div>
        ))}
      </Container>
    </div>
  );
}

export default AllPosts;
