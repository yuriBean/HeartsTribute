import { formatDistanceToNow } from "date-fns";


export default function dateToNow(seconds) {
  return formatDistanceToNow(new Date(seconds * 1000), { addSuffix: true });
}