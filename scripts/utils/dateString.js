export function dateString(dateIso){
  const date = new Date(dateIso);
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate;
}
export function dateStringTracking(dateIso){
  const date = new Date(dateIso);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',    // "Friday"
    month: 'long',      // "August"
    day: 'numeric'      // "8"
  });
  return formattedDate;
}