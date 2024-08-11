import { formatDistanceToNow, format } from "date-fns";


export default function dateToNow(seconds) {
  return formatDistanceToNow(new Date(seconds * 1000), { addSuffix: true });
}

export const  formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};