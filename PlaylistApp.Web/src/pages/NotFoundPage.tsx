import { Link } from 'react-router-dom';
import { ROUTES } from '../core/constants/routes';
import { CoreUIErrors } from '../core/constants/uiText';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">{CoreUIErrors.NotFoundTitle}</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">{CoreUIErrors.NotFoundSubtitle}</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        {CoreUIErrors.NotFoundMessage}
      </p>
      <Link
        to={ROUTES.SONGS}
        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
      >
        {CoreUIErrors.NotFoundBackLink}
      </Link>
    </div>
  );
};