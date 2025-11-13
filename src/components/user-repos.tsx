import { getAccessToken } from "@/actions/get-access-token";
import type { RepoCardT } from "@/types/github";
import RepoCard from "./repo-card";

export default async function UserRepos() {
  const result = await getAccessToken("github");
  const accessToken = result?.accessToken;

  if (!accessToken) {
    return (
      <div>
        <p>
          GitHub account not linked. Please connect your GitHub account to view
          repositories.
        </p>
      </div>
    );
  }

  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("GitHub API error:", response.status, response.statusText);
    return (
      <div>
        <p>
          Failed to fetch repositories. Please check your GitHub connection.
        </p>
      </div>
    );
  }

  const data = await response.json();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No repositories found.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((repo: RepoCardT) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
