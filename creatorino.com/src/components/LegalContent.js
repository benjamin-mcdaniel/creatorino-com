'use client';

import React, { useState } from 'react';
import Layout from './Layout';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import GavelIcon from '@mui/icons-material/Gavel';
import LockIcon from '@mui/icons-material/Lock';
import CookieIcon from '@mui/icons-material/Cookie';

export default function LegalContent() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const lastUpdated = "March 10, 2025";

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Layout title="Legal Information">
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            opacity: 0.1,
            zIndex: 0
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link href="/" passHref>
              <MuiLink underline="hover" color="inherit">Home</MuiLink>
            </Link>
            <Typography color="text.primary">Legal Information</Typography>
          </Breadcrumbs>
          
          <Box>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              fontWeight="bold"
            >
              Legal Information
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Last updated: {lastUpdated}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: theme.palette.grey[50]
            }}
          >
            <Tab icon={<GavelIcon />} label="Terms of Service" iconPosition="start" />
            <Tab icon={<LockIcon />} label="Privacy Policy" iconPosition="start" />
            <Tab icon={<CookieIcon />} label="Cookie Policy" iconPosition="start" />
          </Tabs>
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Terms of Service */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Terms of Service
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Effective date: {lastUpdated}
                </Typography>
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="body1" paragraph>
                  Welcome to Creatorino. Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Creatorino website and service operated by Creatorino, Inc. ("us", "we", "our").
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  1. Accounts
                </Typography>
                
                <Typography variant="body1" paragraph>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  2. Intellectual Property
                </Typography>
                
                <Typography variant="body1" paragraph>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Creatorino, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Creatorino, Inc.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  3. Links To Other Web Sites
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Our Service may contain links to third-party websites or services that are not owned or controlled by Creatorino, Inc.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Creatorino, Inc. has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Creatorino, Inc. shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  4. Termination
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  5. Limitation of Liability
                </Typography>
                
                <Typography variant="body1" paragraph>
                  In no event shall Creatorino, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  6. Contact Us
                </Typography>
                
                <Typography variant="body1" paragraph>
                  If you have any questions about these Terms, please contact us at legal@creatorino.com
                </Typography>
              </Box>
            )}

            {/* Privacy Policy */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Privacy Policy
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Effective date: {lastUpdated}
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" paragraph>
                  Creatorino, Inc. ("us", "we", or "our") operates the Creatorino website and service (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of Personal Information when you use our Service.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We will not use or share your information with anyone except as described in this Privacy Policy. We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  1. Information Collection and Use
                </Typography>
                
                <Typography variant="body1" paragraph>
                  While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, and other information ("Personal Information").
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We collect this information for the purpose of providing the Service, identifying and communicating with you, responding to your requests/inquiries, and improving our services.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  2. Service Data
                </Typography>
                
                <Typography variant="body1" paragraph>
                  When you use our Service to connect to platforms like YouTube, Twitch, or other content creation sites, we collect data from these platforms through their APIs. This may include:
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ pl: 3 }}>
                  • Channel or account statistics<br />
                  • Viewer and subscriber information (in aggregate form)<br />
                  • Content performance metrics<br />
                  • Engagement data
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We use this information to provide analytics, insights, and recommendations to help you improve your content and grow your audience. We never sell this information to third parties.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  3. Log Data
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  4. Cookies
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your computer's hard drive.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  5. Security
                </Typography>
                
                <Typography variant="body1" paragraph>
                  The security of your Personal Information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  6. Contact Us
                </Typography>
                
                <Typography variant="body1" paragraph>
                  If you have any questions about this Privacy Policy, please contact us at privacy@creatorino.com
                </Typography>
              </Box>
            )}

            {/* Cookie Policy */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Cookie Policy
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Effective date: {lastUpdated}
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Typography variant="body1" paragraph>
                  This Cookie Policy explains how Creatorino, Inc. ("us", "we", or "our") uses cookies and similar technologies to recognize you when you visit our website at creatorino.com ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  1. What are cookies?
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Cookies set by the website owner (in this case, Creatorino, Inc.) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  2. Why do we use cookies?
                </Typography>
                
                <Typography variant="body1" paragraph>
                  We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  3. Types of cookies we use
                </Typography>
                
                <Typography variant="body1" paragraph>
                  The specific types of first and third-party cookies served through our Website and the purposes they perform include:
                </Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Essential Cookies:
                </Typography>
                <Typography variant="body1" paragraph>
                  These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.
                </Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Performance/Analytics Cookies:
                </Typography>
                <Typography variant="body1" paragraph>
                  These cookies help us understand how visitors interact with our Website by collecting and reporting information anonymously. They help us to improve the way our Website works, for example, by ensuring that users are finding what they are looking for easily.
                </Typography>
                
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Functionality Cookies:
                </Typography>
                <Typography variant="body1" paragraph>
                  These cookies allow our Website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced, more personal features.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  4. How can you control cookies?
                </Typography>
                
                <Typography variant="body1" paragraph>
                  You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner on our Website.
                </Typography>
                
                <Typography variant="body1" paragraph>
                  You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted.
                </Typography>

                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                  5. Contact Us
                </Typography>
                
                <Typography variant="body1" paragraph>
                  If you have any questions about our use of cookies or other technologies, please contact us at privacy@creatorino.com
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}