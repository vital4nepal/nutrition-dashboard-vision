import React from 'react';
import { Facebook, Globe, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import PageWrapper from '@/components/Layout/PageWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';

const EMAIL = 'nutfellowship@gmail.com';

const channels = [
  { label: 'Facebook', href: 'https://www.facebook.com/nutfellowship/', Icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/nutfellowship/', Icon: Instagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/nutfellowship/', Icon: Linkedin },
  { label: 'X', href: 'https://x.com/nutfellowship', Icon: Twitter },
  { label: 'Website: nutfellowship.com', href: 'https://nutfellowship.com', Icon: Globe },
];

const linkClass =
  'flex items-center gap-3 min-h-[44px] text-base text-gray-700 hover:text-primary transition-colors';

const Chat = () => {
  usePageTitle('Chat with Us');
  return (
    <PageWrapper title="Contact Us">
      <div className="max-w-xl space-y-6">
        <p className="text-base text-gray-600">
          There is no live chat. Send the team an email or message the Nutrition Fellowship on one of its channels.
        </p>
        <a href={`mailto:${EMAIL}`} className={linkClass}>
          <Mail className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="break-all">{EMAIL}</span>
        </a>
        <ul>
          {channels.map(({ label, href, Icon }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </PageWrapper>
  );
};

export default Chat;
