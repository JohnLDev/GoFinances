function formatDate(data: Date): string {
  const date = new Date(data);
  const mnth = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate() + 1}`.slice(-2);

  return [day, mnth, date.getFullYear()].join('/');
}
export default formatDate;
