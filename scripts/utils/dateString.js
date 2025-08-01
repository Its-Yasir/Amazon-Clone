export function dateString(dateIso){
  const date = new Date(dateIso);
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate;
}
