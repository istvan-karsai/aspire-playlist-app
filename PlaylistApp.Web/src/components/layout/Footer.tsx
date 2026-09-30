import { CoreUILayout } from '../../core/constants/uiText';

export const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
        <p>
          {CoreUILayout.FooterBuiltBy}{' '}
          <span className="font-semibold text-gray-700">{CoreUILayout.FooterAuthor}</span>
          {' • '}
          <a
            href="https://github.com/istvan-karsai/aspire-playlist-app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {CoreUILayout.FooterGithub}
          </a>
          {' • '}
          <a href={`mailto:${CoreUILayout.FooterEmail}`} className="text-blue-600 hover:underline">
            {CoreUILayout.FooterEmail}
          </a>
        </p>
      </div>
    </footer>
  );
};
