# Consult Doctor Component

## Overview
The `consult-doctor-box` is a reusable HTML/CSS component that provides important medical disclaimer information to users. It should be manually included on high-traffic pages like herb profiles to ensure users understand when to seek professional medical advice.

## Files
- **HTML Component**: `components/consult-doctor.html`
- **CSS Styles**: Included in `style.css` (lines starting with `.consult-doctor-box`)

## Usage

### How to Include on a Page

Simply copy and paste the HTML from `components/consult-doctor.html` wherever you want the component to appear on your page:

```html
<aside class="consult-doctor-box">
  <h3>Always Consult a Professional</h3>
  <p>The information on this website is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
  <p><strong>See a doctor if:</strong></p>
  <ul>
    <li>You are considering taking a new supplement.</li>
    <li>You are pregnant, breastfeeding, or have a chronic health condition.</li>
    <li>You are taking any prescription medications.</li>
    <li>Your symptoms are severe or persist.</li>
  </ul>
</aside>
```

### Recommended Placement

- **Herb Profile Pages**: Place the component after the main content sections but before the references section
- **Safety Information Pages**: Include near the top or bottom of safety-related content
- **Educational Content**: Add to any page discussing herbal supplements or health information

### Example Placement in Herb Profile

```html
<section class="herb-content">
  <h2>Safety & Side Effects</h2>
  <p>Important safety information...</p>
  
  <!-- Place the consult-doctor-box component here -->
  <aside class="consult-doctor-box">
    <h3>Always Consult a Professional</h3>
    <p>The information on this website is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
    <p><strong>See a doctor if:</strong></p>
    <ul>
      <li>You are considering taking a new supplement.</li>
      <li>You are pregnant, breastfeeding, or have a chronic health condition.</li>
      <li>You are taking any prescription medications.</li>
      <li>Your symptoms are severe or persist.</li>
    </ul>
  </aside>
</section>

<section class="references-section">
  <h2>References</h2>
  <!-- References content -->
</section>
```

## Styling

The component uses a calm blue color scheme with the following CSS classes:

- `.consult-doctor-box` - Main container with light blue background (#e6f2ff)
- `.consult-doctor-box h3` - Heading styled in darker blue (#0056b3)
- `.consult-doctor-box ul` - Bulleted list with standard padding

The component is fully responsive and requires no JavaScript.

## Customization

To modify the component's appearance, edit the CSS in `style.css`:

```css
.consult-doctor-box {
  background-color: #e6f2ff;
  border: 1px solid #b3d7ff;
  border-left: 5px solid #007bff;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 4px;
}
```

To modify the content, edit `components/consult-doctor.html` and update any pages where the component has been manually included.
