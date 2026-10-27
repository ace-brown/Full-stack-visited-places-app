import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { BACKEND_URL } from "../../shared/util/config";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(BACKEND_URL + "/users");

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <div className="page">
      <ErrorModal error={error} onClear={clearError} />
      <div className="page__header">
        <div>
          <h1 className="page__title">Travelers</h1>
          <p className="page__subtitle">
            Discover the places people have visited.
          </p>
        </div>
      </div>
      {isLoading && (
        <div className="center page-loading">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </div>
  );
};

export default Users;
