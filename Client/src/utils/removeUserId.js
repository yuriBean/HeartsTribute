
export default function removeUserId(data) {
  delete data.user_id;
  return data;
}