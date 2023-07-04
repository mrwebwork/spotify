import { Header } from '@/components/Header';

import { AccountContent } from './components/AccountContent';

const Account = () => {
  return (
    <div
      className="
    overflow-hidden
    overflow-y-auto
    h-full
    w-full
    rounded-lg
    bg-neutral-900"
    >
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Account Settings</h1>
        </div>
      </Header>
      <AccountContent />
    </div>
  );
};

export default Account;
