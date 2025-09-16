import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export const LoadingSplashScreen = () => {
  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const loadingCircleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '80%',
    },
  }

  const loadingCircleTransition = {
    duration: 0.8,
    repeatType: 'reverse',
    repeat: Infinity,
    ease: 'easeInOut',
    transition: 'spring',
  }

  const loadingCircle = {
    display: 'block',
    width: '0.2rem',
    height: '0.2rem',
    backgroundColor: '#fff',
    borderRadius: '0.1rem',
  }

  const loadingContainer = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '1.5rem',
    height: '0.5rem',
    marginBottom: '0.3rem',
    marginLeft: '0.1rem',
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        zIndex: '10000',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
        backgroundColor: 'primary.main',
        top: 0,
        left: 0,
        color: '#fff',
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          delay: 0.5,
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <Typography variant="h1">
          <strong>Seja bem-vindo!</strong>
        </Typography>
      </motion.div>
      <div
        style={{
          marginTop: 16,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <span>Estamos preparando tudo</span>
        <motion.div
          style={loadingContainer}
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
        >
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition as any}
          />
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition as any}
          />
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition as any}
          />
        </motion.div>
      </div>
    </Box>
  )
}
