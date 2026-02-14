'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  html_url: string;
};

const MyRepos = () => {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`
          }
        });
        if (!res.ok) {
          console.error("GitHub API error:", res.statusText);
          setRepos([]);
          return;
        }
        const data: Repo[] = await res.json();
        setRepos(data);
      } catch (err) {
        console.error(err);
        setRepos([]);
      }
    };

    fetchRepos();
  }, [session]);

  return (
    <div>
      <h2>Your Repos</h2>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRepos;
