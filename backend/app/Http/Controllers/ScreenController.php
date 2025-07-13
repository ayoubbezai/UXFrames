<?php

namespace App\Http\Controllers;

use App\Models\Screen;
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

        $screens = Screen::with('category:id,name')
            ->where('project_id', $request->project_id)
            ->select('id', 'title', 'purpose as description', 'image_url', 'category_id')
            ->get();

        $screens = $screens->map(function ($screen) {
            return [
                'id' => $screen->id,
                'title' => $screen->title,
                'description' => $screen->description,
                'image_url' => $screen->image_url,
                'category' => $screen->category ? [
                    'id' => $screen->category->id,
                    'name' => $screen->category->name,
                ] : null,
            ];
        });

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
            'type' => 'in:web,mobile,other',
            'purpose' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'actions' => 'nullable|array',
            'inputs' => 'nullable|array',
            'static_content' => 'nullable|array',
            'navigations' => 'nullable|array',
            'states' => 'nullable|array',
            'data' => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('screens', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        // JSON encode array fields
        foreach (['actions', 'inputs', 'static_content', 'navigations', 'states', 'data'] as $jsonField) {
            if (isset($data[$jsonField])) {
                $data[$jsonField] = json_encode($data[$jsonField]);
            }
        }

        $screen = Screen::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Screen created successfully',
            'data' => $screen
        ], 201);
    }

    /**
     * Display the specified screen.
     */
    public function show(Screen $screen)
    {
        $screen->load('category:id,name');

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
            'type' => 'in:web,mobile,other',
            'purpose' => 'nullable|string',
            'category_id' => 'exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'actions' => 'nullable|array',
            'inputs' => 'nullable|array',
            'static_content' => 'nullable|array',
            'navigations' => 'nullable|array',
            'states' => 'nullable|array',
            'data' => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            // Delete old if exists
            if ($screen->image_url) {
                $path = str_replace(asset('storage') . '/', '', $screen->image_url);
                Storage::disk('public')->delete($path);
            }

            $path = $request->file('image')->store('screens', 'public');
            $data['image_url'] = asset('storage/' . $path);
        }

        foreach (['actions', 'inputs', 'static_content', 'navigations', 'states', 'data'] as $jsonField) {
            if (isset($data[$jsonField])) {
                $data[$jsonField] = json_encode($data[$jsonField]);
            }
        }

        $screen->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Screen updated successfully',
            'data' => $screen
        ]);
    }

    /**
     * Remove the specified screen.
     */
    public function destroy(Screen $screen)
    {
        if ($screen->image_url) {
            $path = str_replace(asset('storage') . '/', '', $screen->image_url);
            Storage::disk('public')->delete($path);
        }

        $screen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Screen deleted successfully'
        ]);
    }
}
