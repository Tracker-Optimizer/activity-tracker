import { EyeIcon, StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RepoCardT } from "@/types/github";

interface RepoCardProps {
  repo: RepoCardT;
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <a href={repo.html_url} target="_blank">
            {repo.name}
          </a>
          <Badge variant="outline">{repo.default_branch}</Badge>
        </CardTitle>
        <CardDescription>{repo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <aside className="flex gap-4">
          <div className="flex gap-2">
            <StarIcon />
            <p>{repo.stargazers_count}</p>
          </div>

          <div className="flex gap-2">
            <EyeIcon />
            <p>{repo.watchers_count}</p>
          </div>

          <Badge variant="default">{repo.language}</Badge>
        </aside>

        <div className="flex gap-2">
          <a href={repo.owner.html_url} target="_blank">
            {repo.owner.login}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
