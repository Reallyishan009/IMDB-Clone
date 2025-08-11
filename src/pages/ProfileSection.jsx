import React from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';

const ProfileSection: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        {/* Shows user avatar and menu */}
        <UserButton />
      </SignedIn>

      <SignedOut>
        {/* Show sign in and sign up buttons */}
        <SignInButton>
          <button className="btn">Sign In</button>
        </SignInButton>
        <SignUpButton>
          <button className="btn">Sign Up</button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
};

export default ProfileSection;
