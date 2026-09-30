import { Link } from 'react-router-dom';
import { ROUTES } from '../core/constants/routes';
import { CoreUIErrors } from '../core/constants/uiText';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="mb-4 text-6xl font-extrabold text-gray-900">{CoreUIErrors.NotFoundTitle}</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-700">{CoreUIErrors.NotFoundSubtitle}</h2>
      <p className="mb-8 max-w-md text-gray-500">{CoreUIErrors.NotFoundMessage}</p>
      <Link
        to={ROUTES.SONGS}
        className="rounded-md bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
      >
        {CoreUIErrors.NotFoundBackLink}
      </Link>
    </div>
  );
};
