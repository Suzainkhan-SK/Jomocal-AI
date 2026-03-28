import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email address...');
    const hasFetched = useRef(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(res.data.msg || 'Email successfully verified!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.msg || 'Invalid or expired verification link.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-body transition-colors">
            {/* Background Blobs */}
            <div className={`absolute bottom-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse-slow ${status === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}></div>

            <div className="w-full max-w-sm md:max-w-md bg-surface backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-xl border border-main p-6 md:p-10 animate-fade-in relative z-10 transition-colors text-center">
                
                <div className="mb-6 md:mb-10 block">
                    <img
                        src="/jomocal ai logo.png"
                        alt="Jomocal AI"
                        className="w-32 md:w-40 h-auto object-contain scale-125 mx-auto"
                    />
                </div>

                {status === 'loading' && (
                    <div className="py-8 flex flex-col items-center">
                        <Loader2 className="animate-spin text-blue-500 mb-6" size={64} />
                        <h2 className="text-xl md:text-2xl font-bold text-main mb-2">Verifying...</h2>
                        <p className="text-secondary">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-8 flex flex-col items-center animate-fade-in">
                        <CheckCircle className="text-green-500 mb-6" size={64} />
                        <h2 className="text-xl md:text-2xl font-bold text-main mb-4">Email Verified!</h2>
                        <p className="text-secondary mb-8">{message}</p>
                        <Link to="/login" className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-blue-500/20">
                            Proceed to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-8 flex flex-col items-center animate-fade-in">
                        <XCircle className="text-red-500 mb-6" size={64} />
                        <h2 className="text-xl md:text-2xl font-bold text-main mb-4">Verification Failed</h2>
                        <p className="text-secondary mb-8">{message}</p>
                        <Link to="/signup" className="btn border border-main hover:bg-body text-main w-full py-4 text-lg mb-4">
                            Back to Signup
                        </Link>
                        <Link to="/login" className="text-blue-500 font-bold hover:underline text-sm mt-2">
                            Go to Login instead
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
