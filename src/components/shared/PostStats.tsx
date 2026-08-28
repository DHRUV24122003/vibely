



// //import type { Models } from "appwrite"
// import { useState, useEffect } from "react"
// import { useLocation } from "react-router-dom"

// import { checkIsLiked } from "@/lib/utils"
// import {
//   useLikePost,
//   useSavePost,
//   useDeleteSavedPost,
//   useGetCurrentUser,
// } from "@/lib/react-query/queriesAndMutations"

// type SavedRecord = {
//   $id: string
//   post?: { $id: string }
// }

// type CurrentUserWithSaves = {
//   save?: SavedRecord[]
// }

// // type PostStatsProps = {
// //   post: Models.Document & {
// //     likes: { $id: string }[]
// //     $id: string
// //   }
// //   userId: string
// // }

// import type { IPost } from "@/types"
// import { Loader } from "lucide-react"

// type PostStatsProps = {
//   post: IPost
//   userId: string
// } 

// const PostStats = ({ post, userId }: PostStatsProps) => {
//   const location = useLocation()
// //   const likesList = post.likes.map((user) => user.$id)
// const likesList = post.likes?.map((user) => user.$id) || []

//   const [likes, setLikes] = useState<string[]>(likesList) 
//   const [isSaved, setIsSaved] = useState(false)

//   const { mutate: likePost } = useLikePost()
//   const { mutate: savePost , isPending : isSavingPost} = useSavePost()
//   const { mutate: deleteSavedPost , isPending : isDeletingSaved} = useDeleteSavedPost()

//   const { data: currentUser } = useGetCurrentUser()

//   const savedPostRecord = (currentUser as CurrentUserWithSaves | undefined)?.save?.find(
//     (record) => record.post?.$id === post.$id
//   )

//   useEffect(() => {
//     setIsSaved(!!savedPostRecord)
//   }, [currentUser, savedPostRecord])

//   const handleLikePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     let likesArray = [...likes]

//     if (likesArray.includes(userId)) {
//       likesArray = likesArray.filter((id) => id !== userId)
//     } else {
//       likesArray.push(userId)
//     }

//     setLikes(likesArray)
//     likePost({ postId: post.$id, likesArray })
//   }

//   const handleSavePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     if (savedPostRecord) {
//       setIsSaved(false)
//       return deleteSavedPost(savedPostRecord.$id)
//     }

//     savePost({ userId, postId: post.$id })
//     setIsSaved(true)
//   }

//   const containerStyles = location.pathname.startsWith("/profile")
//     ? "w-full"
//     : ""

//   return (
//     <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
//       <div className="flex gap-2 mr-5">
//        <img
        
//           src={
//             checkIsLiked(likes, userId)
//               ? "/assets/icons/liked.svg"
//               : "/assets/icons/like.svg"
//           }
//           alt="like"
//           width={20}
//           height={20}
//           onClick={handleLikePost}
//           className="cursor-pointer"
//         />
//         <p className="small-medium lg:base-medium">{likes.length}</p>
//       </div>

//       <div className="flex gap-2">
//         {isSavingPost || isDeletingSaved ? <Loader/> : 
//         <img
//           src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
//           alt="save"
//           width={20}
//           height={20}
//           className="cursor-pointer"
//           onClick={handleSavePost}
//         />}
//       </div>
//     </div>
//   )
// }

// export default PostStats













// import { useState, useEffect } from "react"
// import { useLocation } from "react-router-dom"

// import { checkIsLiked } from "@/lib/utils"
// import {
//   useLikePost,
//   useSavePost,
//   useDeleteSavedPost,
//   useGetCurrentUser,
// } from "@/lib/react-query/queriesAndMutations"
// import type { IPost } from "@/types"
// import Loader from "@/components/shared/Loader"

// type SavedRecord = {
//   $id: string
//   post?: { $id: string } | string
// }

// type CurrentUserWithSaves = {
//   save?: SavedRecord[]
// }

// type PostStatsProps = {
//   post: IPost
//   userId: string
// }

// const getSavedPostId = (record: SavedRecord) =>
//   typeof record.post === "string" ? record.post : record.post?.$id

// const PostStats = ({ post, userId }: PostStatsProps) => {
//   const location = useLocation()
//   const likesList = post.likes?.map((user) => user.$id) || []

//   const [likes, setLikes] = useState<string[]>(likesList)
//   const [isSaved, setIsSaved] = useState(false)
//   const [savedRecordId, setSavedRecordId] = useState<string | undefined>()

//   const { mutate: likePost } = useLikePost()
//   const { mutate: savePost, isPending: isSavingPost } = useSavePost()
//   const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost()

//   const { data: currentUser } = useGetCurrentUser()

//   useEffect(() => {
//     const record = (currentUser as CurrentUserWithSaves | undefined)?.save?.find(
//       (item) => getSavedPostId(item) === post.$id
//     )

//     setIsSaved(!!record)
//     setSavedRecordId(record?.$id)
//   }, [currentUser, post.$id])

//   const handleLikePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     let likesArray = [...likes]

//     if (likesArray.includes(userId)) {
//       likesArray = likesArray.filter((id) => id !== userId)
//     } else {
//       likesArray.push(userId)
//     }

//     setLikes(likesArray)
//     likePost({ postId: post.$id, likesArray })
//   }

//   const handleSavePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     if (savedRecordId) {
//       setIsSaved(false)
//       setSavedRecordId(undefined)
//       deleteSavedPost(savedRecordId)
//       return
//     }

//     setIsSaved(true)
//     savePost({ userId, postId: post.$id })
//   }

//   const containerStyles = location.pathname.startsWith("/profile")
//     ? "w-full"
//     : ""

//   return (
//     <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
//       <div className="flex gap-2 mr-5">
//         <img
//           src={
//             checkIsLiked(likes, userId)
//               ? "/assets/icons/liked.svg"
//               : "/assets/icons/like.svg"
//           }
//           alt="like"
//           width={20}
//           height={20}
//           onClick={handleLikePost}
//           className="cursor-pointer"
//         />
//         <p className="small-medium lg:base-medium">{likes.length}</p>
//       </div>

//             <div className="flex gap-2">
//         {isSavingPost || isDeletingSaved ? <Loader/> : 
//         <img
//           src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
//           alt="save"
//           width={20}
//           height={20}
//           onClick={handleSavePost}
//           className="cursor-pointer"
          
//         />}
//       </div>
//     </div>
//   )
// }


// export default PostStats





// import { useEffect, useState } from "react"
// import { useLocation } from "react-router-dom"

// import { checkIsLiked } from "@/lib/utils"
// import {
//   useLikePost,
//   useSavePost,
//   useDeleteSavedPost,
//   useGetSavedPostRecord,
// } from "@/lib/react-query/queriesAndMutations"
// import type { IPost } from "@/types"
// import Loader from "@/components/shared/Loader"

// type PostStatsProps = {
//   post: IPost
//   userId: string
// }

// const PostStats = ({ post, userId }: PostStatsProps) => {
//   const location = useLocation()
//   const likesList = post.likes?.map((user) => user.$id) || []

//   const [likes, setLikes] = useState<string[]>(likesList)
//   const [isSaved, setIsSaved] = useState(false)
//   const [savedRecordId, setSavedRecordId] = useState<string | undefined>()

//   const { mutate: likePost } = useLikePost()
//   const { mutate: savePost, isPending: isSavingPost } = useSavePost()
//   const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
//     useDeleteSavedPost()

//   const { data: savedRecord } = useGetSavedPostRecord(userId, post.$id)

//   useEffect(() => {
//     if (savedRecord?.$id) {
//       setIsSaved(true)
//       setSavedRecordId(savedRecord.$id)
//     } else {
//       setIsSaved(false)
//       setSavedRecordId(undefined)
//     }
//   }, [savedRecord])

//   const handleLikePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     let likesArray = [...likes]

//     if (likesArray.includes(userId)) {
//       likesArray = likesArray.filter((id) => id !== userId)
//     } else {
//       likesArray.push(userId)
//     }

//     setLikes(likesArray)
//     likePost({ postId: post.$id, likesArray })
//   }

//   const handleSavePost = (
//     e: React.MouseEvent<HTMLImageElement, MouseEvent>
//   ) => {
//     e.stopPropagation()

//     if (isSaved && savedRecordId) {
//       const idToDelete = savedRecordId
//       setIsSaved(false)
//       setSavedRecordId(undefined)
//       deleteSavedPost(idToDelete)
//       return
//     }

//     setIsSaved(true)
//     savePost(
//       { userId, postId: post.$id },
//       {
//         onSuccess: (data) => {
//           if (data?.$id) setSavedRecordId(data.$id)
//         },
//         onError: () => {
//           setIsSaved(false)
//           setSavedRecordId(undefined)
//         },
//       }
//     )
//   }

//   const containerStyles = location.pathname.startsWith("/profile")
//     ? "w-full"
//     : ""

//   return (
//     <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
//       <div className="flex gap-2 mr-5">
//         <img
//           src={
//             checkIsLiked(likes, userId)
//               ? "/assets/icons/liked.svg"
//               : "/assets/icons/like.svg"
//           }
//           alt="like"
//           width={20}
//           height={20}
//           onClick={handleLikePost}
//           className="cursor-pointer"
//         />
//         <p className="small-medium lg:base-medium">{likes.length}</p>
//       </div>

//       <div className="flex gap-2">
//         {isSavingPost || isDeletingSaved ? (
//           <Loader />
//         ) : (
//           <img
//             src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
//             alt="save"
//             width={20}
//             height={20}
//             className="cursor-pointer"
//             onClick={handleSavePost}
//           />
//         )}
//       </div>
//     </div>
//   )
// }

// export default PostStats




import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

import { checkIsLiked } from "@/lib/utils"
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetSavedPostRecord,
} from "@/lib/react-query/queriesAndMutations"
import { QUERY_KEYS } from "@/lib/react-query/queryKeys"
import type { IPost } from "@/types"
import Loader from "@/components/shared/Loader"

type PostStatsProps = {
  post: IPost
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const queryKey = [QUERY_KEYS.GET_CURRENT_USER, "saved", userId, post.$id]

  const likesList = post.likes?.map((user) => user.$id) || []
  const [likes, setLikes] = useState<string[]>(likesList)

  const { data: savedRecord, isFetched } = useGetSavedPostRecord(userId, post.$id)
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null)
  const [savedRecordId, setSavedRecordId] = useState<string | undefined>()

  const isSaved = optimisticSaved ?? !!savedRecord?.$id
  const recordId = savedRecordId || savedRecord?.$id

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost()

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation()

    let likesArray = [...likes]
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((id) => id !== userId)
    } else {
      likesArray.push(userId)
    }

    setLikes(likesArray)
    likePost({ postId: post.$id, likesArray })
  }

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation()

    if (isSaved && recordId) {
      setOptimisticSaved(false)
      setSavedRecordId(undefined)
      queryClient.setQueryData(queryKey, null)

      deleteSavedPost(recordId, {
        onError: () => {
          setOptimisticSaved(true)
          setSavedRecordId(recordId)
        },
      })
      return
    }

    setOptimisticSaved(true)
    savePost(
      { userId, postId: post.$id },
      {
        onSuccess: (data) => {
          if (data?.$id) {
            setSavedRecordId(data.$id)
            queryClient.setQueryData(queryKey, data)
          }
        },
        onError: () => {
          setOptimisticSaved(false)
          setSavedRecordId(undefined)
        },
      }
    )
  }

  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : ""

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {!isFetched || isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}

export default PostStats