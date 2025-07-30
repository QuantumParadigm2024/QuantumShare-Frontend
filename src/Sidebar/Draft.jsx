

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   CircularProgress,
//   Container,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button as MuiButton,
// } from "@mui/material";
// import axiosInstance from "../Helper/AxiosInstance";
// import CryptoJS from "crypto-js";
// import { secretKey } from "../Helper/SecretKey";
// import Nav from "../Navbar/Nav";
// import Sidenav from "../Navbar/Sidenav";
// import { DeleteOutline } from "@mui/icons-material";

// const Draft = () => {
//   const [drafts, setDrafts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedCaptions, setExpandedCaptions] = useState({});
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedDraftId, setSelectedDraftId] = useState(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // For preview popup
//   const [previewDraft, setPreviewDraft] = useState(null);
//   const [previewLoading, setPreviewLoading] = useState(false);

//   const decryptToken = (encryptedToken) => {
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
//       return bytes.toString(CryptoJS.enc.Utf8);
//     } catch (error) {
//       console.error("Error decrypting token:", error);
//       return null;
//     }
//   };

//   const encryptedToken = localStorage.getItem("qs");
//   const token = decryptToken(encryptedToken);

//   const fetchDrafts = async () => {
//     const endpath = "/quantum-share/get/drafts";
//     try {
//       const response = await axiosInstance.get(endpath, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.data && response.data.status === "success") {
//         setDrafts(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching drafts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDrafts();
//   }, []);

//   const toggleCaption = (draftId) => {
//     setExpandedCaptions((prev) => ({
//       ...prev,
//       [draftId]: !prev[draftId],
//     }));
//   };

//   const truncate = (text, length) => {
//     if (!text) return "No Caption";
//     if (text.length <= length) return text;
//     return text.substring(0, length) + "...";
//   };

//   const handleDeleteClick = (draftId) => {
//     setSelectedDraftId(draftId);
//     setOpenDialog(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedDraftId) return;

//     setDeleteLoading(true);
//     try {
//       const deleteUrl = `/quantum-share/delete/draft?draftId=${selectedDraftId}`;
//       const response = await axiosInstance.delete(deleteUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data && response.data.status === "success") {
//         fetchDrafts(); // Refresh drafts after deletion
//       } else {
//         console.error("Delete failed:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error deleting draft:", error);
//     } finally {
//       setDeleteLoading(false);
//       setOpenDialog(false);
//       setSelectedDraftId(null);
//     }
//   };

//   const fetchDraftById = async (draftId) => {
//     setPreviewLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/quantum-share/get/draft?draftId=${draftId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data && response.data.status === "success") {
//         setPreviewDraft(response.data.data);
//       } else {
//         console.error("Failed to fetch draft details:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching draft details:", error);
//     } finally {
//       setPreviewLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Nav />
//       <Sidenav />
//       <Container sx={{ mt: 4 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>
//           Saved Drafts
//         </Typography>
//         <Grid container spacing={2}>
//           {drafts.map((draft) => {
//             const draftId = draft.draftId;
//             const isExpanded = expandedCaptions[draftId] || false;
//             const caption = draft.caption || "No Caption";
//             const displayCaption = isExpanded
//               ? caption
//               : truncate(caption, 50);
//             const showMore = caption.length > 50;
//             return (
//               <Grid item xs={12} sm={6} md={4} lg={3} key={draftId}>
//                 <Box
//                   onClick={() => fetchDraftById(draftId)}
//                   sx={{
//                     border: "1px solid #ccc",
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     textAlign: "center",
//                     p: 1,
//                     boxShadow: 2,
//                     position: "relative",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {/* Delete icon at top-right */}
//                   <IconButton
//                     aria-label="delete"
//                     onClick={(e) => {
//                       e.stopPropagation(); // prevent triggering preview popup
//                       handleDeleteClick(draftId);
//                     }}
//                     sx={{
//                       position: "absolute",
//                       top: 4,
//                       right: 4,
//                       bgcolor: "white",
//                       "&:hover": { bgcolor: "grey.300" },
//                     }}
//                   >
//                     <DeleteOutline sx={{ color: "black" }} />
//                   </IconButton>

//                   {draft.contentType &&
//                   draft.contentType.startsWith("video") ? (
//                     <video controls style={{ width: "100%", height: "200px" }}>
//                       <source src={draft.postUrl} type={draft.contentType} />
//                       Your browser does not support the video tag.
//                     </video>
//                   ) : (
//                     <img
//                       src={draft.postUrl}
//                       alt="draft"
//                       style={{ width: "100%", height: "200px" }}
//                     />
//                   )}

//                   <Typography variant="body1" sx={{ mt: 1 }}>
//                     {displayCaption}
//                     {showMore && (
//                       <span
//                         style={{
//                           color: "blue",
//                           cursor: "pointer",
//                           marginLeft: "5px",
//                         }}
//                         onClick={(e) => {
//                           e.stopPropagation(); // prevent triggering preview popup
//                           toggleCaption(draftId);
//                         }}
//                       >
//                         {isExpanded ? " show less" : " show more..."}
//                       </span>
//                     )}
//                   </Typography>
//                 </Box>
//               </Grid>
//             );
//           })}
//         </Grid>
//       </Container>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Delete Draft</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this draft?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setOpenDialog(false)} disabled={deleteLoading}>
//             Cancel
//           </MuiButton>
//           <MuiButton
//             variant="contained"
//             color="error"
//             onClick={handleDeleteConfirm}
//             disabled={deleteLoading}
//           >
//             {deleteLoading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               "Delete"
//             )}
//           </MuiButton>
//         </DialogActions>
//       </Dialog>

//       {/* Preview Dialog */}
//       <Dialog
//         open={Boolean(previewDraft) || previewLoading}
//         onClose={() => setPreviewDraft(null)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle>Draft Preview</DialogTitle>
//         <DialogContent>
//           {previewLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : previewDraft ? (
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 {previewDraft.contentType &&
//                 previewDraft.contentType.startsWith("video") ? (
//                   <video controls style={{ width: "100%", height: "auto" }}>
//                     <source
//                       src={previewDraft.postUrl}
//                       type={previewDraft.contentType}
//                     />
//                     Your browser does not support the video tag.
//                   </video>
//                 ) : (
//                   <img
//                     src={previewDraft.postUrl}
//                     alt="draft"
//                     style={{ width: "100%", height: "auto" }}
//                   />
//                 )}
//               </Grid>

//               {/* Grid with two inner grids */}
//               <Grid item xs={12}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={6}>
//                     <Typography variant="body1" sx={{ fontWeight: "bold" }}>
//                       Caption:
//                     </Typography>
//                     <Typography variant="body2">
//                       {previewDraft.caption || "No Caption"}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={6}>
//                     <Typography variant="body1" sx={{ fontWeight: "bold" }}>
//                       Draft ID:
//                     </Typography>
//                     <Typography variant="body2">
//                       {previewDraft.draftId}
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           ) : (
//             <Typography>No draft data found.</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <MuiButton onClick={() => setPreviewDraft(null)}>Close</MuiButton>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default Draft;


import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  DialogContentText,
  Button,
} from "@mui/material";
import axiosInstance from "../Helper/AxiosInstance";
import CryptoJS from "crypto-js";
import { secretKey } from "../Helper/SecretKey";
import Nav from "../Navbar/Nav";
import Sidenav from "../Navbar/Sidenav";
import { DeleteOutline } from "@mui/icons-material";
import Media from "./Media";
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';


const Draft = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mediaPlatform, setMediaPlatform] = useState([]);
  const [file, setFile] = useState(null);
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [open1, setOpen1] = useState(false);





  // For preview popup
  const [previewDraft, setPreviewDraft] = useState(null);
  console.log(previewDraft);


  const decryptToken = (encryptedToken) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };

  const encryptedToken = localStorage.getItem("qs");
  const token = decryptToken(encryptedToken);

  const fetchDrafts = async () => {
    const endpath = "/quantum-share/get/drafts";
    try {
      const response = await axiosInstance.get(endpath, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.status === "success") {
        setDrafts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const toggleCaption = (draftId) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [draftId]: !prev[draftId],
    }));
  };

  const truncate = (text, length) => {
    if (!text) return "No Caption";
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  const handleDeleteClick = (draftId) => {
    setSelectedDraftId(draftId);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDraftId) return;

    setDeleteLoading(true);
    try {
      const deleteUrl = `/quantum-share/delete/draft?draftId=${selectedDraftId}`;
      const response = await axiosInstance.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.status === "success") {
        fetchDrafts(); // Refresh drafts after deletion
      } else {
        console.error("Delete failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
    } finally {
      setDeleteLoading(false);
      setOpenDialog(false);
      setSelectedDraftId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSelectIconAndSendToParent = (mediaPlatform) => {
    setMediaPlatform(mediaPlatform);
    // if (!mediaPlatform.includes('youtube') && !mediaPlatform.includes('Reddit')) {
    //   setTitle('');
    // }
    // if (!mediaPlatform.includes('Reddit')) {
    //   setSr('');
    // }
    console.log(mediaPlatform);
  };

  const handleCaptionChange = (e) => {
    setPreviewDraft((prev) => ({
      ...prev,
      caption: e.target.value,
    }));
  };

  const handleConfirmDraftCloseOpen = () => {
    setPreviewDraft(false)
  }

  const handleClickOpen = () => {
    setOpen1(true);
  };

  const handleClose = () => {
    setOpen1(false);
  };

  const createFormData = (caption, title, visibility) => {
  const formData = new FormData();
  formData.append("caption", caption);
  if (title) formData.append("title", title);
  if (visibility) formData.append("visibility", visibility);
  return formData;
};
const handleUpdateSaveDraft = async () => {
  if (!previewDraft?.draftId) return;

  const endpoint = `/quantum-share/update/draft?draftId=${previewDraft.draftId}`;
  const formData = createFormData(previewDraft.caption, previewDraft.title, previewDraft.visibility);

  try {
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        'Accept': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Draft updated successfully:", response.data);
    fetchDrafts();
  } catch (err) {
    console.error("Error updating draft:", err);
  }
};


  return (
    <>
      <Nav />
      <Sidenav />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Saved Drafts
        </Typography>
        <Grid container spacing={2}>
          {drafts.map((draft) => {
            const draftId = draft.draftId;
            const isExpanded = expandedCaptions[draftId] || false;
            const caption = draft.caption || "No Caption";
            const displayCaption = isExpanded
              ? caption
              : truncate(caption, 50);
            const showMore = caption.length > 50;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={draftId}>
                <Box
                  onClick={() => setPreviewDraft(draft)} // set clicked draft as preview
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    overflow: "hidden",
                    textAlign: "center",
                    p: 1,
                    boxShadow: 2,
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Delete icon at top-right */}
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(draftId);
                    }}
                    sx={{
                      position: "absolute",
                      top: 1,
                      right: 3,
                      bgcolor: "grey.100",
                      "&:hover": { bgcolor: "grey.300" },
                    }}
                  >
                    <DeleteOutline sx={{ color: "black" }} />
                  </IconButton>

                  {draft.contentType &&
                    draft.contentType.startsWith("video") ? (
                    <video controls style={{ width: "100%", height: "180px" }}>
                      <source src={draft.postUrl} type={draft.contentType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={draft.postUrl}
                      alt="draft"
                      style={{ width: "100%", height: "200px" }}
                    />
                  )}

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {displayCaption}
                    {showMore && (
                      <span
                        style={{
                          color: "blue",
                          cursor: "pointer",
                          marginLeft: "5px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          toggleCaption(draftId);
                        }}
                      >
                        {isExpanded ? " show less" : " show more..."}
                      </span>
                    )}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Draft</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this draft?</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenDialog(false)} disabled={deleteLoading}>
            Cancel
          </MuiButton>
          <MuiButton
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Delete"
            )}
          </MuiButton>
        </DialogActions>
      </Dialog>
      <Dialog className="postContent" open={Boolean(previewDraft)} onClose={() => setPreviewDraft(null)} fullWidth maxWidth="lg">
        <DialogContent >
          <Grid container spacing={1} >
            <Grid item lg={7} md={7} xs={12} sx={{ p: 2 }} >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 id="newPost">New Post</h4>
                <Media onMediaPlatform={handleSelectIconAndSendToParent} initialMediaPlatform={mediaPlatform} postSubmitted={postSubmitted} />
              </div>
              <div className="choose">
                <div style={{ position: 'relative', width: '98%', margin: '20px auto' }}>
                  <textarea
                    className="area"
                    rows={12}
                    value={previewDraft?.caption || ""}
                    name="caption"
                    onChange={handleCaptionChange}
                    style={{
                      width: '100%',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      resize: 'none',
                      outline: 'none',
                      paddingRight: '40px'
                    }}
                    id="textHere"
                  />
                  {/* 
                  <IconButton
                    // onClick={handleListen}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      bottom: '45px',
                      backgroundColor: listening ? 'red' : 'transparent',
                      color: listening ? 'white' : 'black'
                    }}
                  >
                    {listening ? <StopIcon /> : <MicIcon />}
                  </IconButton> */}

                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      fontSize: '10px',
                      // color: caption.length === maxCaptionCharacters ? 'red' : '#666'
                    }}
                  >
                    {/* {caption.length}/{maxCaptionCharacters} */}
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {previewDraft?.contentType?.startsWith("video") ? (
                    <>
                      <video
                        controls
                        style={{
                          maxHeight: "300px",
                          maxWidth: "200px",
                          borderRadius: "10px",
                        }}
                      >
                        <source src={previewDraft.postUrl} type={previewDraft.contentType} />
                        Your browser does not support the video tag.
                      </video>
                      <IconButton
                        onClick={() => setFile(null)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "white",
                          padding: "5px",
                        }}
                      >
                        <CancelIcon style={{ color: "black" }} />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <img
                        src={previewDraft?.postUrl}
                        alt="File Preview"
                        style={{
                          maxHeight: "300px",
                          maxWidth: "200px",
                          borderRadius: "10px",
                        }}
                      />
                      <IconButton
                        onClick={() => setFile(null)}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          backgroundColor: "white",
                          padding: "5px",
                        }}
                      >
                        <CancelIcon style={{ color: "black" }} />
                      </IconButton>
                    </>
                  )}
                </div>

                {/* <div>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap', position: 'relative' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <Tooltip title="Take Photo" placement="top">
                        <IconButton onClick={handleCameraClick}>
                          <PhotoCameraIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Select Photo or Video" placement="top">
                        <IconButton onClick={handleGalleryClick}>
                          <InsertPhotoIcon />
                        </IconButton>
                      </Tooltip>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/, video/"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        name="mediaFile"
                      />
                      {showCamera && (
                        <div style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 2
                        }}>
                          <Webcam ref={webcamRef} style={{ width: '95%', height: '95%' }} />
                          <div style={{ position: 'absolute', bottom: 20, display: 'flex', gap: 10 }}>
                            <IconButton onClick={handleCapture} style={{ color: 'white' }} name="mediaFile" >
                              <PhotoCameraIcon name="mediaFile" />
                            </IconButton>
                            <IconButton onClick={handleStartRecording} style={{ color: 'white' }} name="mediaFile">
                              <FaVideo name="mediaFile" />
                            </IconButton>
                            <IconButton onClick={() => setShowCamera(false)} style={{ color: 'white' }}>
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      )}
                    </div>
                    <Tooltip TransitionComponent={Zoom} title="Add emojis" enterDelay={100} leaveDelay={100} placement="top-end">
                      <IconButton>
                        <MoodOutlinedIcon onClick={handleEmojiIconClick} />
                        <Popover
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={handleClosePopover}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          <EmojiPicker onEmojiClick={addEmoji} />
                        </Popover>
                      </IconButton>
                    </Tooltip>
                    <Tooltip TransitionComponent={Zoom} title="Add Location" enterDelay={100} leaveDelay={100} placement="top-end">
                      <IconButton>
                        <FmdGoodOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Hashtag"
                      enterDelay={100}
                      leaveDelay={100}
                      placement="top-end"
                    >
                      <IconButton onClick={handleIconClick}>
                        <TagIcon />
                      </IconButton>
                    </Tooltip>
                    {showInput && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "70%",
                          left: '25%',
                          transform: "translateY(-16px)",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          background: "#fff",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          width: "300px",
                        }}
                      >
                        <input
                          type="text"
                          value={query}
                          onChange={handleInputChange}
                          placeholder="Type to search hashtags"
                          style={{
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            outline: "none",
                            fontSize: "14px",
                            width: '250px'
                          }}
                        />
                        <IconButton onClick={handleFetchClick} sx={{ position: 'relative', left: '6px' }}>
                          <SendIcon sx={{ color: 'blue' }} />
                        </IconButton>
                        <div
                          style={{
                            width: "300px",
                            height: "200px",
                            borderRadius: "4px",
                            overflowY: "auto",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            border: "1px solid #ccc",
                            background: "#fff",
                            marginTop: "8px",
                          }}
                        >
                          {Array.isArray(suggestions) && suggestions.length > 0 ? (
                            suggestions.map((hashtag, index) => (
                              <div
                                key={index}
                                style={{
                                  padding: "8px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  borderBottom: "1px solid #f0f0f0",
                                }}
                                onClick={() => handleHashtagSelect(hashtag)}
                              >
                                {hashtag}
                              </div>
                            ))
                          ) : (
                            noHashtagMessage && (
                              <div
                                style={{
                                  padding: "8px",
                                  textAlign: "center",
                                  fontSize: "14px",
                                  color: "#999",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                  background: "#fff",
                                  marginTop: "8px",
                                }}
                              >
                                {noHashtagMessage}
                              </div>
                            )
                          )}

                        </div>
                      </div>
                    )}
                    <Tooltip>
                      <IconButton
                        onClick={handleAIComponent}
                        sx={{
                          margin: '20px',
                          padding: '8px 14px',
                          border: '2px solid',
                          borderColor: '#ba343b',
                          outline: 'none',
                          backgroundColor: 'transparent',
                          color: '#333',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          zIndex: 0,
                          animation: 'blinker 2s ease-in-out infinite',
                          transition: 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
                          '&:hover': {
                            color: 'black',
                            backgroundColor: '#FF7300',
                            boxShadow: '0 0 10px rgba(255, 115, 0, 0.6)',
                            borderColor: '#ba343b',
                          },
                          '@keyframes blinker': {
                            '0%': { backgroundColor: 'transparent' },
                            '50%': { backgroundColor: '#FAFAD2' },
                            '100%': { backgroundColor: 'transparent' },
                          },
                        }}
                      >
                        Compose with AI <AutoAwesomeIcon sx={{
                          fontSize: '16px',
                          marginLeft: '5px',
                          animation: 'iconBlinker 2s ease-in-out infinite',
                          '@keyframes iconBlinker': {
                            '0%, 100%': { color: 'white' },
                            '50%': { color: '#ba343b' },
                          },
                        }} />
                      </IconButton>
                    </Tooltip>
                    {AIopen && <QI onAiClose={handleAIClose} />}
                    {mediaPlatform.includes('youtube') && (
                      <FormControl sx={{ width: 242, maxWidth: '100%', marginTop: 2 }}>
                        <InputLabel sx={{ mt: -0.5 }}>Who can see this?</InputLabel>
                        <Select
                          value={visibility}
                          onChange={handleVisibilityChange}
                          label="Who can see this?"
                          sx={{ height: '45px' }}
                        >
                          <MenuItem value="public">Public</MenuItem>
                          <MenuItem value="private">Private</MenuItem>
                          <MenuItem value="unlisted">Unlisted</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    {mediaPlatform.includes('pinterest') && PinterestBoards.length > 0 && (
                      <FormControl sx={{ width: 242, maxWidth: '100%', marginTop: 2 }}>
                        <InputLabel sx={{ mt: -0.5 }}>Select a Pinterest Board</InputLabel>
                        <Select
                          value={boardName}
                          onChange={handleBoardSelect}
                          label="Select a Pinterest Board"
                          sx={{ height: '45px' }}
                        >
                          {PinterestBoards.map((boardName, index) => (
                            <MenuItem key={index} value={boardName}>
                              {boardName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Stack>
                </div> */}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="action">
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            color="error"
            onClick={handleUpdateSaveDraft}
          >
            Save
          </Button>
          <div style={{ display: 'flex' }}>
            {/* {warningMessages.length > 0 && (
              <div style={{ display: 'flex' }}>
                <Tooltip
                  title={
                    <ul style={{ paddingLeft: '10px', margin: '0' }}>
                      {warningMessages.map((message, index) => (
                        <li key={index} style={{ fontSize: '12px' }}>
                          {message}
                        </li>
                      ))}
                    </ul>
                  }
                  arrow
                  enterDelay={300}
                  leaveDelay={100}
                  placement="top"
                >
                  <WarningIcon style={{ color: 'red', cursor: 'pointer', marginTop: '5px' }} />
                </Tooltip>
                <span style={{ color: 'red', fontSize: '12px', marginLeft: '5px' }}></span>
              </div>
            )} */}
            <Button onClick={handleConfirmDraftCloseOpen} color="error">Cancel</Button>
            <Button variant="contained" disabled endIcon={<SendIcon />} onClick={handleClickOpen} sx={{ borderRadius: '20px' }}>Share</Button>
            <Dialog open={open1} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth>
              <DialogContent>
                <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>Are you sure you want to Post?</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} style={{ color: '#ba343b' }}>Cancel</Button>
                {/* <Button onClick={handleSubmit} style={{ color: '#ba343b' }} autoFocus>Yes</Button> */}
              </DialogActions>
            </Dialog>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Draft;
