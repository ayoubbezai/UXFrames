<?php

namespace App\Http\Controllers;

use App\Models\Screen;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ScreenController extends Controller
{
    /**
     * Display a listing of the resource (by project_id).
     */
    public function index(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id'
        ]);

        $screens = Screen::with('category')
            ->where('project_id', $request->project_id)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Screens retrieved successfully',
            'data' => $screens
        ]);
    }

    /**
     * Store a newly created screen.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string',
            'type' => 'required|in:web,mobile,other',
            'purpose' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'actions' => 'nullable|string', // Changed to string to handle JSON
            'inputs' => 'nullable|string', // Changed to string to handle JSON
            'static_content' => 'nullable|string', // Changed to string to handle JSON
            'navigations' => 'nullable|string', // Changed to string to handle JSON
            'states' => 'nullable|string', // Changed to string to handle JSON
            'data' => 'nullable|string', // Changed to string to handle JSON
        ]);

        // Debug logging
        \Log::info('Screen creation request:', [
            'project_id' => $data['project_id'],
            'category_id' => $data['category_id'],
            'title' => $data['title']
        ]);

        // Verify category belongs to the project
        $category = Category::find($data['category_id']);
        if (!$category) {
            \Log::error('Category not found:', ['category_id' => $data['category_id']]);
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
                'data' => null
            ], 404);
        }

        // Convert to integers for proper comparison
        $categoryProjectId = (int) $category->project_id;
        $requestProjectId = (int) $data['project_id'];

        \Log::info('Category validation:', [
            'category_project_id' => $categoryProjectId,
            'request_project_id' => $requestProjectId,
            'category_id' => $data['category_id'],
            'category_name' => $category->name
        ]);

        if ($categoryProjectId !== $requestProjectId) {
            \Log::error('Category project mismatch:', [
                'category_project_id' => $categoryProjectId,
                'request_project_id' => $requestProjectId,
                'category_id' => $data['category_id']
            ]);
            return response()->json([
                'success' => false,
                'message' => 'This category does not belong to the specified project',
                'data' => [
                    'category_project_id' => $categoryProjectId,
                    'request_project_id' => $requestProjectId,
                    'category_id' => $data['category_id']
                ]
            ], 400);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('screens', 'public');
            $data['image_url'] = $path; // Store only the path, not the full URL
        }

        // Convert JSON strings to arrays for storage
        foreach (['actions', 'inputs', 'static_content', 'navigations', 'states', 'data'] as $jsonField) {
            if (isset($data[$jsonField]) && is_string($data[$jsonField])) {
                $decoded = json_decode($data[$jsonField], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $data[$jsonField] = $decoded;
                } else {
                    // If JSON is invalid, set as empty array
                    $data[$jsonField] = [];
                }
            } else {
                // If field is not provided, set as empty array
                $data[$jsonField] = [];
            }
        }

        $screen = Screen::create($data);

        \Log::info('Screen created successfully:', ['screen_id' => $screen->id]);

        return response()->json([
            'success' => true,
            'message' => 'Screen created successfully',
            'data' => $screen->load('category')
        ], 201);
    }

    /**
     * Display the specified screen.
     */
    public function show(Screen $screen)
    {
        $screen->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Screen retrieved successfully',
            'data' => $screen
        ]);
    }

    /**
     * Update the specified screen.
     */
    public function update(Request $request, Screen $screen)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:web,mobile,other',
            'purpose' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'actions' => 'nullable|string', // Changed to string to handle JSON
            'inputs' => 'nullable|string', // Changed to string to handle JSON
            'static_content' => 'nullable|string', // Changed to string to handle JSON
            'navigations' => 'nullable|string', // Changed to string to handle JSON
            'states' => 'nullable|string', // Changed to string to handle JSON
            'data' => 'nullable|string', // Changed to string to handle JSON
        ]);

        // Verify category belongs to the project if category_id is being updated
        if (isset($data['category_id'])) {
            $category = Category::find($data['category_id']);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                    'data' => null
                ], 404);
            }

            // Convert to integers for proper comparison
            $categoryProjectId = (int) $category->project_id;
            $screenProjectId = (int) $screen->project_id;

            if ($categoryProjectId !== $screenProjectId) {
                return response()->json([
                    'success' => false,
                    'message' => 'This category does not belong to the specified project',
                    'data' => [
                        'category_project_id' => $categoryProjectId,
                        'screen_project_id' => $screenProjectId,
                        'category_id' => $data['category_id']
                    ]
                ], 400);
            }
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($screen->image_url) {
                $path = str_replace(asset('storage') . '/', '', $screen->image_url);
                Storage::disk('public')->delete($path);
            }

            $path = $request->file('image')->store('screens', 'public');
            $data['image_url'] = $path; // Store only the path, not the full URL
        }

        // Convert JSON strings to arrays for storage
        foreach (['actions', 'inputs', 'static_content', 'navigations', 'states', 'data'] as $jsonField) {
            if (isset($data[$jsonField]) && is_string($data[$jsonField])) {
                $decoded = json_decode($data[$jsonField], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $data[$jsonField] = $decoded;
                } else {
                    // If JSON is invalid, set as empty array
                    $data[$jsonField] = [];
            }
            }
            // If field is not provided, don't update it (keep existing value)
        }

        $screen->update($data);

        // Debug log to confirm update
        \Log::info('Screen updated:', $screen->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Screen updated successfully',
            'data' => $screen->load('category')
        ]);
    }

    /**
     * Remove the specified screen.
     */
    public function destroy(Screen $screen)
    {
        try {
        if ($screen->image_url) {
            $path = str_replace(asset('storage') . '/', '', $screen->image_url);
            Storage::disk('public')->delete($path);
        }

        $screen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Screen deleted successfully'
        ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete screen',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
