// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   TextField,
//   Paper
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ChatIcon from '@mui/icons-material/Chat';

// const ChatBotComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleChat = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 10,
//         right: 10,
//         zIndex: 9999
//       }}
//     >
//       {isOpen ? (
//         <Paper elevation={8}
//           sx={{
//             width: { xs: 300, sm: 350 },
//             height: 450,
//             display: 'flex',
//             flexDirection: 'column',
//             borderRadius: 2,
//             overflow: 'hidden',
//           }}
//         >
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#ba343b', p: 1 }}>
//             <Typography variant="subtitle1" sx={{ color: '#fff', pl: 1 }}>
//               🤖 QuantumAI
//             </Typography>
//             <IconButton onClick={toggleChat} size="small" sx={{ color: '#fff' }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
//             <Typography variant="body2" gutterBottom>
//               Hi! Welcome to Quantum AI. I'll be assisting you here today.
//             </Typography>
//             <Typography variant="body2" gutterBottom>
//               How can I help you today?
//             </Typography>
//             <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
//               {/* <Button variant="outlined" size="small">Book a Demo</Button> */}
//               <Button variant="outlined" size="small">Know about me</Button>
//               {/* <Button variant="outlined" size="small">Chatbot use cases</Button> */}
//             </Box>
//           </Box>

//           {/* Input */}
//           <Box sx={{ display: 'flex', borderTop: '1px solid #ccc', p: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type a message..."
//               variant="outlined"
//             />
//             <Button variant="contained" sx={{ ml: 1 }}>➤</Button>
//           </Box>
//         </Paper>
//       ) : (
//         <IconButton
//           onClick={toggleChat}
//           sx={{
//             bgcolor: '#1976d2',
//             color: 'white',
//             '&:hover': { bgcolor: '#1565c0' },
//             width: 60,
//             height: 60
//           }}
//         >
//           <ChatIcon fontSize="large" />
//         </IconButton>
//       )}
//     </Box>
//   );
// };

// export default ChatBotComponent;


// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   TextField,
//   Paper
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import ChatIcon from '@mui/icons-material/Chat';
// import axios from 'axios';

// const ChatBotComponent = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputMessage, setInputMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const toggleChat = () => setIsOpen(!isOpen);

//   useEffect(() => {
//     if (messages.length === 0) {
//       setMessages([
//         {
//           sender: 'bot',
//           text: '👋 Hi! How can I help you today?',
//           isHTML: false
//         }
//       ]);
//     }
//   }, []);

//   const handleSend = async () => {
//     if (!inputMessage.trim()) return;

//     const newMessages = [...messages, { sender: 'user', text: inputMessage }];
//     setMessages(newMessages);
//     setInputMessage('');
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         'http://localhost:7532/quantum-share/aitext',
//         null,
//         {
//           params: { userMessage: inputMessage }
//         }
//       );

//       const rawText = response.data?.data || "I'm sorry, I didn't get that.";

//       const formattedText = rawText
//         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//         .replace(/\n\* /g, '<br />• ')
//         .replace(/\n/g, '<br />');

//       setMessages([
//         ...newMessages,
//         { sender: 'bot', text: formattedText, isHTML: true }
//       ]);
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         { sender: 'bot', text: '❌ Error connecting to AI bot.' }
//       ]);
//     }

//     setLoading(false);
//   };

//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         bottom: 16,
//         right: 16,
//         zIndex: 9999
//       }}
//     >
//       {isOpen ? (
//         <Paper
//           elevation={12}
//           sx={{
//             width: { xs: 320, sm: 370 },
//             height: 500,
//             display: 'flex',
//             flexDirection: 'column',
//             borderRadius: '20px',
//             overflow: 'hidden',
//             boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               bgcolor: '#d32f2f',
//               p: 1.5,
//               px: 2
//             }}
//           >
//             <Typography
//               variant="subtitle1"
//               sx={{ color: '#fff', fontWeight: 600 }}
//             >
//               🤖 QuantumBot
//             </Typography>
//             <IconButton onClick={toggleChat} size="small" sx={{ color: '#fff' }}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box
//             sx={{
//               flex: 1,
//               p: 2,
//               overflowY: 'auto',
//               backgroundColor: '#fdf7f7ff'
//             }}
//           >
//             {messages.map((msg, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   textAlign: msg.sender === 'user' ? 'right' : 'left',
//                   mb: 1
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     display: 'inline-block',
//                     bgcolor: msg.sender === 'user' ? '#d32f2f' : '#ffffff',
//                     color: msg.sender === 'user' ? '#fff' : '#000',
//                     borderRadius: 3,
//                     px: 1.8,
//                     py: 1.2,
//                     maxWidth: '80%',
//                     wordBreak: 'break-word',
//                     boxShadow:
//                       msg.sender === 'user'
//                         ? '0 2px 6px rgba(211, 47, 47, 0.3)'
//                         : '0 1px 4px rgba(0,0,0,0.1)'
//                   }}
//                   dangerouslySetInnerHTML={{ __html: msg.text }}
//                 />
//               </Box>
//             ))}
//             {loading && (
//               <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
//                 Bot is typing....
//               </Typography>
//             )}
//           </Box>

//           <Box
//             sx={{
//               display: 'flex',
//               borderTop: '1px solid #eee',
//               p: 1.5,
//               backgroundColor: '#fff'
//             }}
//           >
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Type your message..."
//               variant="outlined"
//               value={inputMessage}
//               onChange={(e) => setInputMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               sx={{ borderRadius: '8px' }}
//             />
//             <Button
//               variant="contained"
//               onClick={handleSend}
//               sx={{
//                 ml: 1,
//                 bgcolor: '#d32f2f',
//                 '&:hover': { bgcolor: '#b71c1c' },
//                 borderRadius: '8px',
//                 px: 2
//               }}
//             >
//               ➤
//             </Button>
//           </Box>
//         </Paper>
//       ) : (
//         <IconButton
//           onClick={toggleChat}
//           sx={{
//             bgcolor: '#d32f2f',
//             color: 'white',
//             '&:hover': { bgcolor: '#b71c1c' },
//             width: 64,
//             height: 64,
//             borderRadius: '50%',
//             boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
//           }}
//         >
//           <ChatIcon fontSize="large" />
//         </IconButton>
//       )}
//     </Box>
//   );
// };

// export default ChatBotComponent;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Paper,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const ChatBotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: '👋 Hi! How can I help you today?',
          isHTML: false
        }
      ]);
    }
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: inputMessage }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:7532/quantum-share/aitext',
        null,
        { params: { userMessage: inputMessage } }
      );

      const rawText = response.data?.data || "I'm sorry, I didn't get that.";
      const formattedText = rawText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\* /g, '<br />• ')
        .replace(/\n/g, '<br />')

      setMessages([
        ...newMessages,
        { sender: 'bot', text: formattedText, isHTML: true }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: 'bot', text: '❌ Error connecting to AI bot.' }
      ]);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999
      }}
    >
      {isOpen ? (
        <Paper
          elevation={12}
          sx={{
            width: { xs: 320, sm: 370 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#d32f2f',
              p: 1.5,
              px: 2
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ color: '#fff', fontWeight: 600 }}
            >
              🤖 Quantum Bot
            </Typography>
            <IconButton onClick={toggleChat} size="small" sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: 'auto',
              backgroundColor: '#fdf7f7ff'
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  mb: 1.5
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    bgcolor: msg.sender === 'user' ? '#d32f2f' : '#ffffff',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                    boxShadow:
                      msg.sender === 'user'
                        ? '0 2px 6px rgba(211, 47, 47, 0.3)'
                        : '0 1px 4px rgba(0,0,0,0.1)'
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', gap: 1, ml: 1, alignItems: 'center' }}>
                <CircularProgress size={14} thickness={5} />
                <Typography variant="caption" fontStyle="italic">
                  Bot is typing...
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              borderTop: '1px solid #eee',
              p: 1.5,
              backgroundColor: '#fff'
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              variant="outlined"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              sx={{ borderRadius: '8px' }}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              sx={{
                ml: 1,
                bgcolor: '#d32f2f',
                '&:hover': { bgcolor: '#b71c1c' },
                borderRadius: '8px',
                px: 2
              }}
            >
              ➤
            </Button>
          </Box>
        </Paper>
      ) : (
        // <IconButton
        //   onClick={toggleChat}
        //   sx={{
        //     bgcolor: '#d32f2f',
        //     color: 'white',
        //     '&:hover': { bgcolor: '#b71c1c' },
        //     width: 64,
        //     height: 64,
        //     borderRadius: '50%',
        //     animation: `${pulse} 2s infinite`,
        //     boxShadow: '0 6px 12px rgba(0,0,0,0.3)'
        //   }}
        // >
        //   <ChatIcon fontSize="large" />
        // </IconButton>
        <Box sx={{ position: 'relative' }}>
          {/* Speech bubble */}
          <Box
            sx={{
              position: 'absolute',
              top: -32,
              right: -12,
              backgroundColor: '#fff',
              color: '#d32f2f',
              fontSize: 12,
              fontWeight: 'bold',
              px: 1.5,
              py: 0.5,
              borderRadius: '12px',
              border: '1px solid #ddd',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              zIndex: 1,
              animation: `${pulse} 3s infinite`
            }}
          >
            Hii!
          </Box>
          <IconButton
            onClick={toggleChat}
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              p: 0,
              animation: `${pulse} 2s infinite`,
              boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#ffe5e5'
              }
            }}
          >
            <img
              src="https://png.pngtree.com/png-clipart/20230401/original/pngtree-smart-chatbot-cartoon-clipart-png-image_9015126.png"
              alt="Chatbot"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ChatBotComponent;


