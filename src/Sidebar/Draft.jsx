/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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