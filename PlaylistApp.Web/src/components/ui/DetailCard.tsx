import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export const DetailCard = ({ children }: { children: ReactNode }) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {children}
    </div>
);

interface DetailCardHeaderProps {
    title: string;
    subtitle?: ReactNode;
    backTo: string;
    backLabel: string;
}

export const DetailCardHeader = ({ title, subtitle, backTo, backLabel }: DetailCardHeaderProps) => (
    <div className="px-4 py-5 sm:px-6">
        <Link
            to={backTo}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline mb-4 inline-block"
        >
            &larr; {backLabel}
        </Link>
        <h3 className="text-2xl leading-6 font-bold text-gray-900">
            {title}
        </h3>
        {subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {subtitle}
            </p>
        )}
    </div>
);

export const DetailCardList = ({ children }: { children: ReactNode }) => (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
            {children}
        </dl>
    </div>
);

export const DetailCardListItem = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {children}
        </dd>
    </div>
);

export const DetailRelationList = ({ children, isEmpty, emptyMessage }: { children: ReactNode; isEmpty: boolean; emptyMessage: string }) => {
    if (isEmpty) {
        return <span className="text-gray-500 italic">{emptyMessage}</span>;
    }

    return (
        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {children}
        </ul>
    );
};

export const DetailRelationListItem = ({ children }: { children: ReactNode }) => (
    <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
        <div className="w-0 flex-1 flex items-center">
            <span className="ml-2 flex-1 w-0 truncate font-medium">
                {children}
            </span>
        </div>
    </li>
);