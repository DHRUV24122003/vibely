
import type { IUpdatePost, INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases,storage } from "./config";
import { ID, Query } from "appwrite";



export async function createUserAccount(user: INewUser) {
  // Create a new user account in Appwrite and save the user data to the database
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
      
    );

    if (!newAccount) throw Error;
    //  default avatar URL from name
    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
     
  } catch (error) {
    console.log(error);
    return error;
  }
}





//this function saves the user data to the database after creating the account in Appwrite in a new row of users table
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}



export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession (user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}





export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) return null;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) return null;

    return currentUser.documents[0];
  } catch (error) {
    console.log("No current user:", error);
    return null;
  }
}


export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}



export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )
    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}





export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      fileId
    )

    if (!fileUrl) throw Error
    return fileUrl
  } catch (error) {
    console.log(error)
  }
}


export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0])
    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || []

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file && post.file.length > 0

  try {
    let imageUrl = String(post.imageUrl)
    let imageId = String(post.imageId)

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      imageUrl = String(fileUrl)
      imageId = uploadedFile.$id
    }

    // const tags =
    // post.tags
    // ?.split(",")
    // .map((tag) => tag.trim())
    // .filter(Boolean) || []

    const normalizeTags = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value.join(",") : value || ""
  return raw
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
}

const tags = normalizeTags(post.tags)

    const payload = {
      caption: post.caption,
      location: post.location || "",
      imageUrl,
      imageId,
      tags,
    }

    console.log("UPDATE PAYLOAD", payload)

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      payload
    )

    if (!updatedPost) {
      if (hasFileToUpdate) await deleteFile(imageId)
      throw Error
    }

    if (hasFileToUpdate) {
      await deleteFile(post.imageId)
    }

    return updatedPost
  } catch (error) {
    console.log("UPDATE ERROR", error)
    throw error
  }
}

// export async function getRecentPosts() {
//   try {
//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       [Query.orderDesc("$createdAt"), Query.limit(20)]
//     );

//     if (!posts) throw Error;

//     return posts;
//   } catch (error) {
//     console.log(error);
//   }
// }




export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if (!posts) throw Error

    const documents = await Promise.all(
      posts.documents.map((post) => populateCreator(post))
    )

    return { ...posts, documents }
  } catch (error) {
    console.log(error)
  }
}


// ============================== GET PERSONALIZED FEED POSTS

export async function getFeedPosts(userId?: string) {
  if (!userId) {
    return null;
  }

  try {
    // 1. Find everyone current user follows
    const followRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.limit(100),
      ]
    );

    // 2. Extract their Users document IDs
    const followingIds = followRecords.documents.map(
      (record) => record.followingId as string
    );

    // 3. Include current user's own posts
    const feedUserIds = [
      userId,
      ...followingIds,
    ];

    // 4. Get posts created by current user + followed users
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.equal("creator", feedUserIds),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]
    );

    return posts;
  } catch (error) {
    console.log(
      "GET FEED POSTS ERROR:",
      error
    );

    throw error;
  }
}


export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}



export async function getSavedPostRecord(userId: string, postId: string) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", userId), Query.equal("post", postId)]
    )

    return result.documents[0] || null
  } catch (error) {
    console.log(error)
    return null
  }
}



export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}


   
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
 
    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;
 
    return posts;
  } catch (error) {
    console.log(error);
  }
}



export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}


export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}



async function populateCreator(post: any) {
  if (!post?.creator || typeof post.creator !== "string") {
    return post
  }

  try {
    const creator = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      post.creator
    )
    return { ...post, creator }
  } catch {
    return post
  }
}

// ============================== GET ALL USERS

export async function getUsers() {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ]
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log("GET USERS ERROR:", error);
    throw error;
  }
}


// ============================== GET USER BY ID

export async function getUserById(userId?: string) {
  if (!userId) return null;

  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log("GET USER BY ID ERROR:", error);
    throw error;
  }
}



// ============================== FOLLOW USER

export async function followUser(
  followerId: string,
  followingId: string
) {
  if (!followerId || !followingId) {
    throw new Error("Follower and following IDs are required");
  }

  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  try {
    // Prevent duplicate follow records
    const existingFollow = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
        Query.limit(1),
      ]
    );

    if (existingFollow.documents.length > 0) {
      return existingFollow.documents[0];
    }

    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      ID.unique(),
      {
        followerId,
        followingId,
      }
    );

    return follow;
  } catch (error) {
    console.log("FOLLOW USER ERROR:", error);
    throw error;
  }
}


// ============================== UNFOLLOW USER

export async function unfollowUser(
  followerId: string,
  followingId: string
) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
        Query.limit(1),
      ]
    );

    const followRecord = result.documents[0];

    if (!followRecord) {
      return { status: "not-following" };
    }

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      followRecord.$id
    );

    return { status: "ok" };
  } catch (error) {
    console.log("UNFOLLOW USER ERROR:", error);
    throw error;
  }
}


// ============================== GET FOLLOW STATUS

export async function getFollowStatus(
  followerId?: string,
  followingId?: string
) {
  if (!followerId || !followingId) {
    return null;
  }

  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followingId", followingId),
        Query.limit(1),
      ]
    );

    return result.documents[0] || null;
  } catch (error) {
    console.log("GET FOLLOW STATUS ERROR:", error);
    throw error;
  }
}


// ============================== GET FOLLOWERS

export async function getFollowers(userId?: string) {
  if (!userId) return null;

  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followingId", userId),
        Query.limit(100),
      ]
    );
  } catch (error) {
    console.log("GET FOLLOWERS ERROR:", error);
    throw error;
  }
}


// ============================== GET FOLLOWING

export async function getFollowing(userId?: string) {
  if (!userId) return null;

  try {
    return await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followsCollectionId,
      [
        Query.equal("followerId", userId),
        Query.limit(100),
      ]
    );
  } catch (error) {
    console.log("GET FOLLOWING ERROR:", error);
    throw error;
  }
}