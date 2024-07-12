import "./AddUser.css";
import React from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  serverTimestamp,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { toast } from "react-toastify";
import { useUserStore } from "../../../../lib/userStore";

const AddUser = () => {
  const [user, setUser] = React.useState(null);
  const { currentUser } = useUserStore();
  const handleSearch = async (e) => {
    setUser(null);
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    try {
      const userRef = collection(db, "users");

      // Create a query against the collection.
      const u = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(u);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        toast.error("Username " + username + " does not exist.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error searching for user." + error);
    }
  };

  const handleAddUser = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Create a new chat document
      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Prepare the chat data
      const chatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        updatedAt: Date.now(),
      };

      // Add the new chat to the user's chat collection
      await setDoc(
        doc(userChatsRef, user.id),
        {
          chats: arrayUnion(chatData),
        },
        { merge: true }
      );

      // Add the new chat to the current user's chat collection
      chatData.receiverId = user.id;
      await setDoc(
        doc(userChatsRef, currentUser.id),
        {
          chats: arrayUnion(chatData),
        },
        { merge: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          {user.username != currentUser.username && (
            <button onClick={handleAddUser}>Add User</button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddUser;
